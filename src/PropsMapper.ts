import {Observable} from 'rxjs/Observable'

export interface PropsMapper<EP, IP> {
   (externalProps: EP): Observable<IP>
}
