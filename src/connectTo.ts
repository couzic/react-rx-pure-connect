import * as React from 'react'
import {Observable, Subject, Subscription} from 'rxjs'
import {ConnectOptions} from './ConnectOptions'
import {ConnectedComponent} from './ConnectedComponent'
import {shallowEqual} from './shallowEqual'
import {defaultConnectOptions} from './defaultConnectOptions'

export function connectTo<EP, IP>(WrappedComponent: React.SFC<IP>,
                                  internalProps$: Observable<IP>,
                                  userOptions?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> {

   const options: ConnectOptions<EP, IP> = {...defaultConnectOptions, ...userOptions}

   return class ComponentConnectedToObservable extends React.Component<EP, {}> {
      private externalProps$ = new Subject<EP>()
      private externalSubscription: Subscription
      private internalSubscription: Subscription
      private internalProps: IP

      shouldComponentUpdate() {
         return false
      }

      componentWillMount() {
         options.componentWillMount(this.props)
         if (userOptions && userOptions.onExternalPropsChange) {
            this.externalSubscription = this.externalProps$
               .distinctUntilChanged(shallowEqual)
               .subscribe((externalProps: EP) => options.onExternalPropsChange(externalProps))
            this.externalProps$.next(this.props)
         }
         this.internalSubscription = internalProps$
            .distinctUntilChanged(shallowEqual)
            .subscribe((internalProps: IP) => {
               this.internalProps = internalProps
               options.onInternalPropsChange(internalProps)
               this.forceUpdate()
            })
      }

      componentDidMount() {
         options.componentDidMount(this.props)
      }

      componentWillReceiveProps(nextProps: EP) {
         options.componentWillReceiveExternalProps(nextProps)
         this.externalProps$.next(nextProps)
      }

      componentWillUnmount() {
         this.externalSubscription && this.externalSubscription.unsubscribe()
         this.internalSubscription.unsubscribe()
         options.componentWillUnmount(this.props, this.internalProps)
      }

      render() {
         if (this.internalProps)
            return WrappedComponent(this.internalProps)
         else
            return options.spinner({})
      }

   }
}
