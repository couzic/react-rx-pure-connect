import * as React from 'react'
import {Subject} from 'rxjs/Subject'
import {Subscription} from 'rxjs/Subscription'
import {ConnectedComponent} from './ConnectedComponent'
import {ConnectOptions} from './ConnectOptions'
import {shallowEqual} from './shallowEqual'
import {PropsMapper} from './PropsMapper'
import {defaultConnectOptions} from './defaultConnectOptions'

export function connectWithMapper<EP, IP>(WrappedComponent: React.SFC<IP>,
                                          propsMapper: PropsMapper<EP, IP>,
                                          userOptions?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> {

   const options: ConnectOptions<EP, IP> = {...defaultConnectOptions, ...userOptions}

   return class ConnectComponentWithMapper extends React.Component<EP, {}> {
      private externalProps$ = new Subject<EP>()
      private subscription: Subscription
      private internalProps: IP

      shouldComponentUpdate() {
         return false
      }

      componentWillMount() {
         options.componentWillMount(this.props)
         this.subscription = this.externalProps$
            .distinctUntilChanged(shallowEqual)
            .map((externalProps: EP) => {
               options.onExternalPropsChange(externalProps)
               return externalProps
            })
            .switchMap(propsMapper)
            .distinctUntilChanged(shallowEqual)
            .subscribe((internalProps: IP) => {
               this.internalProps = internalProps
               options.onInternalPropsChange(internalProps)
               this.forceUpdate()
            })
         this.externalProps$.next(this.props)
      }

      componentDidMount() {
         options.componentDidMount(this.props)
      }

      componentWillReceiveProps(nextProps: EP) {
         options.componentWillReceiveExternalProps(nextProps)
         this.externalProps$.next(nextProps)
      }

      componentWillUnmount() {
         this.subscription.unsubscribe()
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
