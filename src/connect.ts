import {Observable} from 'rxjs/Observable'
import {connectTo} from './connectTo'
import {ConnectOptions} from './ConnectOptions'
import {ConnectedComponent} from './ConnectedComponent'
import {connectWithMapper} from './connectWith'
import {PropsMapper} from './PropsMapper'

export function connect<IP>(WrappedComponent: React.SFC<IP>) {

   return {
      to: <EP>(internalProps$: Observable<IP>, options?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> => connectTo(WrappedComponent, internalProps$, options),
      WithMapper: <EP>(propsMapper: PropsMapper<EP, IP>, options?: Partial<ConnectOptions<EP, IP>>): ConnectedComponent<EP> => connectWithMapper(WrappedComponent, propsMapper, options)
   }

}
