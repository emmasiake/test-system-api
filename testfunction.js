var assert = require('chai').assert;
function hypotenuse(a, b) {return Math.sqrt(a * a + b * b); } 
describe('myFunction()', function() {
var tests = [{args: [3, 4], expected: 5},{args: [6, 8], expected: 10},{args: [12, 16], expected: 20},{args: [24, 32], expected: 40},];
tests.forEach(function(test) {
        it('correctly adds ' + test.args.length + ' args', function() {
            var res = hypotenuse.apply(null, test.args);
            assert.equal(res, test.expected);
        });
    });});