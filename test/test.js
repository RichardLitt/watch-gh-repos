import test from 'ava'
import fn from './'

test('With minimal since and until', t => {
  return fn('opensourcedesign').then(result => {
    t.same(result, [])
  })
	// TODO add tests
})
