const _ = require('lodash')

function noOpts (opts) {
  return _.isEmpty(_.filter(opts, (opt, key) => {
    if (['t', 'token', 'e', 'enterprise'].indexOf(key) === -1 && opt) {
      return opt
    }
  }))
}

function logStringOrArray (input) {
  input = (_.isArray(input)) ? input : [input]
  _.forEach(input, (x) => console.log(x))
}

module.exports = { noOpts, logStringOrArray }