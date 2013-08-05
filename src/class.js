
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

var create = Object.create ? 
        function(o) { return Object.create(o) } : 
        (function() { // Reusable constructor function for the Object.create() shim.
            function F() {}
            return function(o) {
                F.prototype = o
                return new F
            }
        }())

// define a class
function Class(name, superClass, factory) {
    if (!factory) {
        if (!superClass) {
            throw new Error('class create failed, verify definitions')
        }
        factory = superClass
        superClass = Object
    }

    function Constructor() {
        if ( U.isFunction(this.init) ) {
            this.init.apply(this, arguments)
        }
    }
    Constructor.toString = function() { return name }

    var supr = superClass.prototype
    // var proto = Constructor.prototype = new superClass
    var proto = Constructor.prototype = create(supr)
    proto.constructor = factory
    factory.call(proto, supr)
    
    mix(proto, Event)

    if (Class.amd) return Constructor
    var obj = namespace(name, Class.globalNamespace)
    obj.namespace[obj.className] = Constructor
}

Class.statics = function(clazz, obj) {
    mix(clazz, obj)
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
// Class.globalNamespace = global /* or window */
// Class.amd = false

