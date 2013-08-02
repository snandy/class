/*!
 * Class.js v0.1.0
 * Small, fast, elegant, powerful, and cross platform JavaScript OOP library. Support class, inheritance, namespace, private and more.
 * @snandy 2013-08-02 23:46:54
 *
 */
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

// initialize namespace
function namespace(classPath, globalNamespace) {
    if ( !U.isString(classPath) ) throw new Error('classPath must be a string')
    globalNamespace = U.isObject(globalNamespace) ? globalNamespace : global
    var arr = classPath.split('.')
    var namespace = globalNamespace
    var className = arr.pop()

    while (arr.length) {
        var name = arr.shift()
        var obj = namespace[name]
        if (!obj) {
            namespace[name] = obj = {}
        }
        namespace = obj
    }

    var clazz = namespace[className]
    if ( U.isFunction(clazz) ) throw new Error(className + ' is already defined')
    namespace[className] = undefined
    return {
        namespace: namespace,
        className: className
    }
}

// define a class
function Class(classPath, superClass, classImp) {
    if (!classImp) {
        classImp = superClass
        superClass = Object
    }
    function Constructor() {
        if ( U.isFunction(this.init) ) {
            this.init.apply(this, arguments)
        }
    }
    var proto = Constructor.prototype = new superClass()
    Constructor.prototype.constructor = classImp
    Constructor.toString = function() {return classPath}
    var supr = superClass.prototype
    classImp.call(proto, supr)
    
    var obj = namespace(classPath, Class.globalNamespace)
    obj.namespace[obj.className] = Constructor
}

Class.statics = function(clazz, obj) {
    for (var a in obj) clazz[a] = obj[a]
}

Class.methods = function(clazz, obj, override) {
    var proto = clazz.prototype
    for (var m in obj) {
        if ( !U.isFunction(obj[m]) ) throw new Error(m + ' is not a function')
        if (override) {
            proto[m] = obj[m]
        } else {
            if (!proto[m]) {
                proto[m] = obj[m]
            }
        }
    }
}

// defaults
// Class.globalNamespace = global

// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Class', [], function() { return Class } )
} else {
    // global.namespace = namespace
    global.Class = Class
}

}(this);