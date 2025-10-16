const test = require('node:test');
const assert = require('assert');

const { HashPass, VerifyPass } = require('./cryptography.js');

const PASS1 = "HiIAmStrongPassword123!";
const PASS2 = "HiIAmWrongPasswordOopsie!";

test('password hash', async (t) => {
    return HashPass(PASS1); // just DO it!
})

test('Wrong password should fail comparison', async (t) => {
    const hashOfPass = await HashPass(PASS1);
    const doesMatchHash = await VerifyPass(PASS2,hashOfPass); // comparing PASS2 against saved PASS1 hash
    assert.strictEqual(doesMatchHash, false);
})

test('Good password pass comparison', async (t) => {
    const hashOfPass = await HashPass(PASS1);
    const doesMatchHash = await VerifyPass(PASS1,hashOfPass);
    assert.strictEqual(doesMatchHash, true);
})