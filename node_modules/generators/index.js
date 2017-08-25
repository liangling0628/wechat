var fs = require("fs")
// var util = require("util")
// var path = require("path")
// var chain = require("continuable/chain")
var map = require("continuable/map")
var esprima = require("esprima")
var escodegen = require("escodegen")
var astw = require("astw")

var parseAsyncName = require("./transforms/parse-async-name")
var stripAsyncCalls = require("./transforms/strip-async-calls")
var generatorToContinuable = require("./transforms/generator-to-continuable")
var addContinuableDeps = require("./transforms/continuable-deps")

module.exports = generators

// generators := (uri: String) => String
function generators(uri) {
    var file = fs.readFile.bind(null, uri)

    var ast = map(file, function (source) {
        source = String(source)

        return [source, esprima.parse(source, {
            loc: true,
            range: true,
            tokens: true,
            comment: true,
            raw: true
        })]
    })

    return map(ast, generatorify)
}

// generatorify := (EsprimaAst) => String
function generatorify(tuple) {
    var source = tuple[0]
    var ast = tuple[1]
    var walk = astw(ast)

    walk(function (node) {
        if (node.type && node.range) {
            var start = node.range[0]
            var end = node.range[1]
            node.codeSource = source.substring(start, end)
        }

        return node
    })

    var asyncName = parseAsyncName(ast)
    stripAsyncCalls(asyncName, ast)
    generatorToContinuable(ast)
    addContinuableDeps(ast)

    // var computedAst = { type: "Program", body: ast.body }

    return escodegen.generate(ast, {
        format: {
            json: true,
            quotes: "double",
            escapeless: true,
            semicolons: false
        },
        comment: true
    }) + "\n"
}

