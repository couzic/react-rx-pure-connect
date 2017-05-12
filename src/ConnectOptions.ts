import {defaultSpinner, Spinner} from './Spinner'

export interface ConnectOptions<EP, IP> {
   spinner: Spinner
   onExternalPropsChange: (externalProps: EP) => void
   onInternalPropsChange: (internalProps: EP) => void
   componentWillMount: (externalProps: EP) => void
   componentDidMount: (externalProps: EP) => void
   componentWillReceiveExternalProps: (externalProps: EP) => void
   componentWillUnmount: (externalProps: EP, internalProps: IP) => void
}

export const defaultConnectOptions: ConnectOptions<any, any> = {
   spinner: defaultSpinner,
   onExternalPropsChange: () => null,
   onInternalPropsChange: () => null,
   componentWillMount: () => null,
   componentDidMount: () => null,
   componentWillReceiveExternalProps: () => null,
   componentWillUnmount: () => null
}
