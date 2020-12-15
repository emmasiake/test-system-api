var assert = require('chai').assert;
function sum_in_interval(a, b) {
var sum = 0;
for (var i = a; i <= b; i++) {
sum += i;
}
return sum;
}
describe('myFunction()', function() {
var tests = [{args: [5, 6], expected: 11},{args: [5, 8], expected: 26},{args: [1, 100], expected: 5050},{args: [-1, 1], expected: 0},];
tests.forEach(function(test) {
        it('correctly adds ' + test.args.length + ' args', function() {
            var res = sum_in_interval.apply(null, test.args);
            assert.equal(res, test.expected);
        });
    });});