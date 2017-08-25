transform.Break = Break

module.exports = transform

function Break(value) {
    return { value: value, is: "break" }
}

function transform(ast, lambda) {
    return ast.some(function (v, index) {
        return applyResult(ast, index, transformNode(v, ast))
    })

    function applyResult(obj, key, result) {
        if (!result) {
            return
        }

        if (result.is === "break") {
            if (result.value) {
                obj[key] = result.value
            }
            return true
        }

        if (result) {
            obj[key] = result
        }
    }

    function transformNode(node, parent) {
        if (!isASTNode(node)) {
            return node
        }

        if (parent) {
            node.parent = parent
        }
        var oldNode = node
        node = lambda(node)

        if (isBreak(node) === "break") {
            return node.value
        }

        if (!isASTNode(node)) {
            return oldNode
        }

        var broken = Object.keys(node).some(function (k) {
            var value = node[k]
            var newValue

            if (k === "parent") {
                newValue = value
            } else if (Array.isArray(value)) {
                var broken = value.some(function (v, index) {
                    return applyResult(value, index,
                        transformNode(v, node))
                })

                if (broken) {
                    return true
                }

                newValue = value
            } else if (typeof value === "object") {
                return applyResult(node, k,
                    transformNode(value, node))
            } else {
                newValue = value
            }

            if (!isASTNode(newValue)) {
                newValue = value
            }

            node[k] = newValue
        })

        return broken ? Break(node) : node
    }
}

function isBreak(value) {
    return value && value.is === "break"
}

function isASTNode(node) {
    return typeof node === "object" && node !== null && node.type
}
