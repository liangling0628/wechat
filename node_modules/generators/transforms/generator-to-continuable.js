var astw = require("astw")
var esprima = require("esprima")

/* Look for generator functions in the ast and transform them
    into functions that return continuables

*/
// changeGeneratorToContinuable := (EsprimaAST)
module.exports = changeGeneratorToContinuable

function changeGeneratorToContinuable(ast) {
    var walk = astw(ast)

    walk(function (node) {
        if (node.type !== "FunctionDeclaration") {
            return
        }

        if (!node.generator) {
            return
        }

        node.generator = false

        var body = node.body.body
        var returnStatement = body.filter(function (n) {
            return n.type === "ReturnStatement"
        })[0] || null
        var returnAst

        if (!returnStatement) {
            returnAst = esprima.parse("return of(undefined)\n", {
                tolerant: true
            })

            body.push(returnAst.body[0])
        } else {
            var returnStr = "return of(" +
                returnStatement.argument.codeSource + ")\n"
            returnAst = esprima.parse(returnStr, {
                tolerant: true
            })
            var index = body.indexOf(returnStatement)
            body.splice(index, 1, returnAst.body[0])
            // console.log("body", body)
            // console.log("return", returnStatement)
        }
    })
}
