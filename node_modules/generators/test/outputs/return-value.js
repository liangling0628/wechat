var of = require("continuable\/of");
module.exports = someGenerator;
function someGenerator() {
    return of({
        foo: "bar",
        baz: "quux"
    })
}
