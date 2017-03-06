const test = require('ava').test
const fn = require('../.')

test('With minimal since and until', t => {
  return fn('opensourcedesign').then(result => {
    t.same(result, [])
  })
	// TODO add tests
})
