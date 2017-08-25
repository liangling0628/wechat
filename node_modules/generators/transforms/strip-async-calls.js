var astw = require("astw")

module.exports = stripAsyncCalls

/* This function looks for things like

`module.exports = async(someGenerator)`

and removes the invocation of `async`

*/
// stripAsyncCalls := (String, EsprimaAST)
function stripAsyncCalls(asyncName, ast) {
    var walk = astw(ast)

    walk(function (node) {
        if (node.type !== "CallExpression") {
            return
        }

        if (node.callee.name !== asyncName) {
            return
        }

        node.parent.right = node.arguments[0]
    })
}
