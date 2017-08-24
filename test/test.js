const test = require('ava').test
// const fn = require('../.')
const lib = require('../src/lib.js')

test('noOpts will ignore token flag', t => {
  t.is(true, lib.noOpts({token: 'Hello world'}))
})

test('noOpts will ignore enterprise flag', t => {
  t.is(true, lib.noOpts({token: 'Hello world'}))
})

test('noOpts will not ignore random flag', t => {
  t.is(false, lib.noOpts({random: 'Hello world'}))
})

test('noOpts will not ignore random bool flag', t => {
  t.is(false, lib.noOpts({random: true}))
})




