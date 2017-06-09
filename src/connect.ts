import {Observable} from 'rxjs'
import {connectTo} from './connectTo'
import {ConnectOptions} from './ConnectOptions'
import {ConnectedComponent} from './ConnectedComponent'
import {connectWithMapper} from './connectWithMapper'
import {PropsMapper} from './PropsMapper'

export function connect<IP>(WrappedComponent: React.SFC<IP>) {

   return {
      to: <EP>(internalProps$: Observable<IP>, options?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> => connectTo(WrappedComponent, internalProps$, options),
      withMapper: <EP>(propsMapper: PropsMapper<EP, IP>, options?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> => connectWithMapper(WrappedComponent, propsMapper, options)
   }

}
