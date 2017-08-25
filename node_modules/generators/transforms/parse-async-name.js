var astw = require("astw")

module.exports = parseAsyncName

/* This function looks for

`var async = require("continuable-generators")`

And will remove that statement from the AST. It will return
    the name of the function returned from continuable-generators
*/
// parseAsyncName := (EsprimaAST) => String
function parseAsyncName(ast) {
    var asyncName
    var walk = astw(ast)

    walk(function (node) {
        if (node.type !== "VariableDeclaration") {
            return
        }

        var declaration = node.declarations[0]
        var expr = declaration.init
        var moduleRequired = expr.arguments[0].value

        if (moduleRequired !== "continuable-generators") {
            return node
        }

        asyncName = declaration.id.name

        var parent = node.parent
        var index = parent.body.indexOf(node)
        parent.body.splice(index, 1)
    })

    return asyncName
}
