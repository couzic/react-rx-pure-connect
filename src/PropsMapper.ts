import {Observable} from 'rxjs'

export interface PropsMapper<EP, IP> {
   (externalProps: EP): Observable<IP>
}
