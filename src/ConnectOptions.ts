import {Spinner} from './Spinner'

export interface ConnectOptions<EP, IP> {
   spinner: Spinner
   onExternalPropsChange: (externalProps: EP) => void
   onInternalPropsChange: (internalProps: IP) => void
   componentWillMount: (externalProps: EP) => void
   componentDidMount: (externalProps: EP) => void
   componentWillReceiveExternalProps: (externalProps: EP) => void
   componentWillUnmount: (externalProps: EP, internalProps: IP) => void
}

