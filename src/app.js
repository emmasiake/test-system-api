var Mocha = require('mocha');
const express = require('express')
const bodyParser = require('body-parser');
const fs = require("fs")
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/', function (req, res) {
    var solution = req.body.solution;
    var functionName = req.body.function;
    var testsJSON = req.body.tests;
    var testsArray = JSON.parse(testsJSON);
    var tests = [];
    for (var i = 0; i < testsArray.args.length; i++) {
        if (testsArray.args[i].length > 0) {
            tests.push({
                args: testsArray.args[i].split(", "),
                expected: testsArray.result[i]
            })
        }
    }
    console.log(tests);
    var testOut = "["
    for(var i = 0; i < tests.length; i++) {
        testOut += `{args: [${tests[i].args.join(", ")}], expected: ${tests[i].expected}},`;
    }
    testOut += "]";

    console.log(tests);
    let file = "testfunction.js";

    fs.writeFileSync(file, "var assert = require('chai').assert;\n");
    fs.appendFileSync(file, solution + "\n");
    fs.appendFileSync(file, "describe('myFunction()', function() {\n");
    fs.appendFileSync(file, "var tests = " + testOut + ";\n");
    fs.appendFileSync(file, "tests.forEach(function(test) {\n" +
        "        it('correctly adds ' + test.args.length + ' args', function() {\n" +
        "            var res = " + functionName + ".apply(null, test.args);\n" +
        "            assert.equal(res, test.expected);\n" +
        "        });\n" +
        "    });")

    fs.appendFileSync(file, "});")

    var mocha = new Mocha({});
    var results = [];

    mocha.addFile(file)
    var passed = 0;
    var failed = 0;
    mocha.run()
        .on('test', function(test) {
            //console.log('Test started: '+test.title);
        })
        .on('test end', function(test) {
            //console.log('Test done: '+test.title);
        })
        .on('pass', function(test) {
            passed++;
            results.push({message: "Test passed"})
        })
        .on('fail', function(test, err) {
            failed++;
            results.push({message: "Test failed", error: err})
        })
        .on('end', function() {
            result = passed / (passed + failed)
            res.send({results, result});
        });
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})