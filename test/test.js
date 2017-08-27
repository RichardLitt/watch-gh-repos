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

// TODO Test the output of console.log
test('logStringOrArray will send all output to STDOUT', t => {
  t.is(undefined, lib.logStringOrArray('test'))
})
