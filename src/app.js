var Mocha = require('mocha');
const express = require('express')
const mysql = require("mysql")
const schedule = require('node-schedule');
const fs = require("fs")



// const bodyParser = require('body-parser');

// const app = express()
// const port = 3000
// app.use(bodyParser.urlencoded({ extended: true }));


var j = schedule.scheduleJob('*/2 * * * * *', function(){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'test_system'
    });

    connection.query('SELECT * FROM solution LEFT JOIN task ON solution.task_id=task.task_id  WHERE solution.status=0', function (error, results, fields) {
        if (error) throw error;
        if (results) {
            for (var j = 0; j < results.length; j++) {
                var solution_id = results[j].solution_id;
                var solution = results[j].solution;
                var functionName = results[j].function_name;
                var testsJSON = results[j].tests;
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
                for (var i = 0; i < tests.length; i++) {
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
                    .on('pass', function (test) {
                        passed++;
                        results.push({message: "Test passed"})
                    })
                    .on('fail', function (test, err) {
                        failed++;
                        results.push({message: "Test failed", error: err})
                    })
                    .on('end', function () {
                        result = passed / (passed + failed)
                        //res.send({results, result});
                        //console.log({results, result});
                        var connection = mysql.createConnection({
                            host     : 'localhost',
                            user     : 'root',
                            password : '',
                            database : 'test_system'
                        });
                        connection.query(`UPDATE solution SET test_result='${JSON.stringify({results, result})}', result=${result}, status=1 WHERE solution_id=${solution_id}`, function (error, results1, fields) {
                            if (error) throw error;
                            console.log(solution_id);
                            connection.end();
                        });
                    });
            }
        }
    })
    connection.end();
});
