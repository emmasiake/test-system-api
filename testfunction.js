var assert = require('chai').assert;
function sum(a, b) {return (a+b)}
describe('myFunction()', function() {
var tests = [{args: [2, 5], expected: 7},{args: [4, 6], expected: 10},{args: [8, 4], expected: 12},{args: [9, 9], expected: 18},];
tests.forEach(function(test) {
        it('correctly adds ' + test.args.length + ' args', function() {
            var res = sum.apply(null, test.args);
            assert.equal(res, test.expected);
        });
    });});