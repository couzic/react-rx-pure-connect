import * as React from 'react'

export interface ConnectedComponent<EP> extends React.ComponentClass<EP> {
   new(props: EP): React.Component<EP, {}> // TODO Delete
}
