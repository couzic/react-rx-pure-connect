import * as React from 'react'

export interface Spinner extends React.SFC<{}> {
}

export const defaultSpinner: Spinner = () => <div className='react-rx-pure-connect-spinner'/>
