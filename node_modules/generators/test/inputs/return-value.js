var async = require("continuable-generators")

module.exports = async(someGenerator)

function* someGenerator() {
    return {
        foo: "bar",
        baz: "quux"
    }
}
