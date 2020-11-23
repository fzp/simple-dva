
# simple-dva

simple-dva is a simple implementation of [DVA](https://github.com/dvajs/dva) as a library instead of framework. So you can introduce domain model into your React/Redux project without a big change.

## Domain Model

Domain Model is used to handle data of a component in a single page. it consists of namespace, state, reducer, effect.

### Namespace

the key name in the Redux store. It is also the prefix of all action type in this model.

### State

The initial state in the Redux store.

### Reducer

Same as Redux reducerm, is used to handle synchronous action.
A default reducer `${namespace}/save` is introduced.
It is similar with `setState` in React component, is used to update state in the Redux store.

### Effect

Redux-Saga worker, is used to handle asynchronous action, accepts an `action`, and Redux-Saga `effects` as parameters.
some important effect:
`call(fn, ...args)` : call `fn(...args)`
`put(action)` : dispatch an action

## Example

Check [simple-dva-example](https://github.com/fzp/simple-dva-example) for details.

## Available Scripts

In the project directory, you can run:

### `npm start`

Build the project

### `npm publish`

Publish the project
