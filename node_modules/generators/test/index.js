var test = require("tape-continuable")
var async = require("continuable-generators")
var parallel = require("continuable-para")
var wrap = require("continuable-generators/wrap")
var path = require("path")
var fs = require("fs")

var readFile = wrap(fs.readFile)

var generators = require("../index")

test("generators is a function", async(function* (assert) {
    assert.equal(typeof generators, "function")
}))

test("generators on empty", async(function* (assert) {
    var input = path.join(__dirname, "inputs", "empty.js")
    var output = path.join(__dirname, "outputs", "empty.js")
    var out = yield parallel({
        generated: generators(input),
        desired: readFile(output)
    })

    out.desired = String(out.desired)

    assert.equal(out.generated, out.desired)
}))

test("generators on return value", async(function* (assert) {
    var input = path.join(__dirname, "inputs", "return-value.js")
    var output = path.join(__dirname, "outputs", "return-value.js")
    var out = yield parallel({
        generated: generators(input),
        desired: readFile(output)
    })

    out.desired = String(out.desired)

    assert.equal(out.generated, out.desired)
}))
