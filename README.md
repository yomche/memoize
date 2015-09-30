# JavaScript Practice

## Purpose

This practice covers the following:

1. *Function* as *First Citizen*.
2. *ES6* features.
3. *BDD* with *Mocha*, *Chai* and *Sinon*.
4. *NPM* infrastructure.

## Memoize

### Overview

Memoize function idea has been taken from [Lodash](https://lodash.com/docs#memoize).
Please take a look to the original [specification](https://lodash.com/docs#memoize).
Then study the differences list:

1. Cache key generation strategy is not customizable. *Resolver* support is **not** necessary.
2. All arguments should be considered by caching mechanism. **Not** only the first argument.

### Steps

1. Fork this repository.
2. Checkout forked repository.
1. Install [Node.js](http://nodejs.org/).
2. Install project dependencies by `npm install`.
3. Run tests by `npm run test` (tests should fail).
4. Go to the *src* folder and implement *memoize* function.
5. Check your progress against specification (tests).
6. And don't forget to commit working decision ;)

### Additional Tasks

1. Extend original specification in *test/memoize.spec.js* with additional requirements.
2. Try to simplify your decision by means of *Lodash* library.
3. Propose the way to deal with [ES2016 Decorators](https://github.com/wycats/javascript-decorators) and implement some example.
