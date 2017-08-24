const _ = require('lodash')

function noOpts (opts) {
  return _.isEmpty(_.filter(opts, (opt, key) => {
    if (['t', 'token', 'e', 'enterprise'].indexOf(key) === -1 && opt) {
      return opt
    }
  }))
}

module.exports = { noOpts }