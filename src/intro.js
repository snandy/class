~function(global, undefined) {
    
var U = {}
var toString = Object.prototype.toString

// Iterator
function forEach(obj, iterator, context) {
    if ( obj.length === +obj.length ) {
        for (var i=0; i<obj.length; i++) {
            iterator(obj[i], i, obj)
        }
    } else {
        for (var k in obj) {
            iterator(obj[k], k, obj)
        }
    }
}

// U.isArray, U.isBoolean, ...
forEach(['Array', 'Boolean', 'Function', 'Object', 'String', 'Number'], function(name) {
    U['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})