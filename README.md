# vue-mixed-props
[![npm](https://img.shields.io/npm/v/vue-mixed-props.svg)](vue-mixed-props) ![npm](https://img.shields.io/npm/dt/vue-mixed-props.svg)

Let's say, application has a component, which already has some props defined as an array of strings and it is totally fine for developer or dev team to leave it as it is:

```javascript
export default {
  name: 'SampleComponent',
  props: [ 'foo', 'bar', 'baz' ]
}
```

But then, one day, a new prop should be added with type and default value defined. Currently developer has to rewrite existing array of props into object just for adding 1 new prop with default value.

Current plugin allows using mixed array of strings and object for detailed props:

```javascript
export default {
  name: 'SampleComponent',
  props: [
    'foo',
    'bar',
    'baz',
    {
      tar: {
        type: String,
        default: 'Hi'
      }
    }
  ]
}
```
Or you can use object for `props` with array of some string props:
```javascript
  export default {
    name: 'SampleComponent',
    props: {
      $strings: ['foo', 'bar', 'baz'],
      tar: {
        type: String,
        default: 'Hi'
      }
    }
  }
``` 


Usage:
```javascript
  import Vue from 'vue'
  import MixedProps from 'vue-mixed-props'

  Vue.use(MixedProps)
```

Plugin works also with SSR.
