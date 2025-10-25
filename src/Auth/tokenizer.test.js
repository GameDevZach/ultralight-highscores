const test = require('node:test');
const assert = require('assert');

const { GetRandomString } = require('./tokenizer.js');

test("String Randomizer Gives Random Results", () => {
    const str1 = GetRandomString();
    const str2 = GetRandomString();
    console.log(str1, str2);

    assert.notEqual(str1,str2);
})