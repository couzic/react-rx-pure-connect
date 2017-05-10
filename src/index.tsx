import * as React from 'react'
import {Observable, Subject, Subscription} from 'rxjs'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import {shallowEqual} from './shallowEqual'

export interface ConnectOptions<EP, IP> {
   spinner: Spinner
   onWillMount: (externalProps: EP) => void
   onWillUnmount: (externalProps: EP, internalProps: IP) => void
}

export interface PropsMapper<EP, IP> {
   (externalProps: EP): Observable<IP>
}

export interface ConnectedComponent<EP> extends React.ComponentClass<EP> {
   new(props: EP): React.Component<EP, {}>
}

export interface Spinner extends React.StatelessComponent<{}> {
}

const defaultSpinner: Spinner = () => <div className="react-rx-pure-connect-spinner"/>

const defaultOptions: ConnectOptions<any, any> = {
   spinner: defaultSpinner,
   onWillMount: () => null,
   onWillUnmount: () => null
}

function wrapper<EP, IP>(propsMapper: PropsMapper<EP, IP>,
                         WrappedComponent: React.StatelessComponent<IP>,
                         userOptions?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> {

   const options: ConnectOptions<EP, IP> = {...defaultOptions, ...userOptions}

   return class extends React.Component<EP, { internalProps: IP }> {
      private externalProps$ = new Subject<EP>()
      private subscription: Subscription

      componentWillMount() {
         options.onWillMount(this.props)
         this.subscription = this.externalProps$
            .distinctUntilChanged(shallowEqual)
            .switchMap(propsMapper)
            .distinctUntilChanged(shallowEqual)
            .subscribe(internalProps => this.setState({internalProps}))
         this.externalProps$.next(this.props)
      }

      componentWillReceiveProps(nextProps: EP) {
         this.externalProps$.next(nextProps)
      }

      componentWillUnmount() {
         this.subscription.unsubscribe()
         options.onWillUnmount(this.props, this.state.internalProps)
      }

      render() {
         if (this.state !== null)
            return WrappedComponent(this.state.internalProps)
         else
            return options.spinner({})
      }

   }
}

export const connectTo = <EP, IP>(props$: Observable<IP>,
                                  Component: React.StatelessComponent<IP>,
                                  options?: Partial<ConnectOptions<{}, IP>>): ConnectedComponent<{}> =>
   wrapper(() => props$, Component, options)

export const connectWith = <EP, IP>(propsMapper: PropsMapper<EP, IP>,
                                    Component: React.StatelessComponent<IP>,
                                    options?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> =>
   wrapper(propsMapper, Component, options)

// Deprecated
export const connect = <EP, IP>(propsMapper: PropsMapper<EP, IP>) =>
   (wrappedComponent: React.StatelessComponent<IP>, spinner?: Spinner): ConnectedComponent<EP> =>
      wrapper(propsMapper, wrappedComponent, spinner)
