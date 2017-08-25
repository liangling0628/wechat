var esprima = require("esprima")

/* this prefixes the code with the dependencies needed to do
    programming with continuables
*/
// addContinuableDeps := (EsprimaAST)
module.exports = addContinuableDeps

function addContinuableDeps(ast) {
    var body = ast.body
    var ofAst = esprima.parse("var of = require(\"continuable/of\")\n")

    body.unshift(ofAst.body[0])
}
