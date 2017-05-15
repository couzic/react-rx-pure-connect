import * as React from 'react'
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import {Subscription} from 'rxjs/Subscription'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import {ConnectedComponent} from './ConnectedComponent'
import {ConnectOptions, defaultConnectOptions} from './ConnectOptions'
import {shallowEqual} from './shallowEqual'

export interface PropsMapper<EP, IP> {
   (externalProps: EP): Observable<IP>
}

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
