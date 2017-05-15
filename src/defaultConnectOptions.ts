import {defaultSpinner} from './defaultSpinner'
import {ConnectOptions} from './ConnectOptions'

export const defaultConnectOptions: ConnectOptions<any, any> = {
   spinner: defaultSpinner,
   onExternalPropsChange: () => null,
   onInternalPropsChange: () => null,
   componentWillMount: () => null,
   componentDidMount: () => null,
   componentWillReceiveExternalProps: () => null,
   componentWillUnmount: () => null
}
