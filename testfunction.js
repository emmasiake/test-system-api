var assert = require('chai').assert;
function  conversion(a, b) {
    var c = (a / b).toFixed(2);
    return c;
}
describe('myFunction()', function() {
var tests = [{args: [1, 27], expected: 0.04},{args: [27, 27], expected: 1},{args: [50, 27], expected: 1.85},{args: [5000, 30], expected: 166.66},];
tests.forEach(function(test) {
        it('correctly adds ' + test.args.length + ' args', function() {
            var res = conversion.apply(null, test.args);
            assert.equal(res, test.expected);
        });
    });});