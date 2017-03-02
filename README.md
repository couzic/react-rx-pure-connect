# react-rx-pure-connect

#### Connecting RxJS Observables to Pure React Stateless Functional Components, written in TypeScript

## Usage

### Simple example

```ts
import * as React from 'react'
import {connect} from 'react-rx-pure-connect'

const Component: React.StatelessComponent<{name: string}> = ({name}) => <h1>Hello, {name}</h1>

const propsMapper = () => Observable({name: 'Bob'})
   
const Greeter = connect(propsMapper)(Component)

const UI = () => <Greeter />

```

### Complete example

```ts
import * as React from 'react'
import {connect} from 'react-rx-pure-connect'
 
interface Person {
   name: string
}

interface InternalProps {
   person: Person
}

const Component: React.StatelessComponent<InternalProps> = ({person}) => <h1>Hello, {person.name}</h1>

interface PublicProps {
   personId: number
}

// maps PublicProps to Observable<InternalProps>
const propsMapper = (props: PublicProps) => personRepo
   .find(props.personId)
   .map(person => ({person}))
   
const Greeter = connect(propsMapper)(Component)

const UI = () => <Greeter personId={123} />

```
