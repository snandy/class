/*!
 * Class.js v0.1.0
 * Small, fast, elegant, powerful, and cross platform JavaScript OOP library. Support class, inheritance, namespace, private and more.
 * @snandy 2013-08-03 07:51:54
 *
 */
~function(global, undefined) {
    
var U = {}
var toString = Object.prototype.toString
var slice = Array.prototype.slice

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

function mix(obj) {
    forEach(slice.call(arguments, 1), function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop]
            }
        }
    })
    return obj
}


function Observer(type, context) {
    this.type = type
    this.scope = context || global
    this.listeners = []
}

Observer.prototype = {
    subscribe: function(fn, scope, options) {
        var listeners = this.listeners
        if (!fn || this._find(fn, scope) !== -1) return false

        var listener = {
            fn: fn,
            scope: scope || this.scope,
            opt: options
        }

        if (this.firing) {
            // if we are currently firing this event, don't disturb the listener loop
            listeners = this.listeners = listeners.slice(0)
        }
        listeners.push(listener)

        return true
    },
    unsubscribe: function(fn, scope) {
        if (!fn) {
            return this.clear()
        }

        var index = this._find(fn, scope)
        if (index !== -1) {
            this._delete(index)
            return true
        }

        return false
    },
    publish: function() {
        var listeners = this.listeners
        var count = listeners.length
        var i = 0, xargs, listener

        if (count > 0) {
            this.firing = true
            while (listener = listeners[i++]) {
                xargs = slice.call(arguments, 0)
                if (listener.opt) {
                    xargs.push(listener.opt)
                }
                if (listener && listener.fn.apply(listener.scope, xargs) === false) {
                    return (this.firing = false)
                }
            }
        }
        this.firing = false

        return true
    },
    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed
     */
    clear: function() {
        var l = this.listeners.length, i = l
        while (i--) this._delete(i)
        this.listeners = []
        return l
    },
    /**
     * Returns the matchs listener index by the specified fn and scope.
     * Used by the unsubscribe method to match the right subscriber.
     */
    _find: function(fn, scope) {
        var listeners = this.listeners
        var i = listeners.length
        var listener, s

        while (i--) {
            if (listener = listeners[i]) {
                if (listener.fn === fn && (!scope || listener.scope === scope)) return i
            }
        }
        return -1
    },
    /**
     * @method _delete
     * @private
     */
    _delete: function(index) {
        var listeners = this.listeners
        var o = listeners[index]
        if (o) {
            delete o.fn
            delete o.scope
            delete o.opt
        }
        listeners.splice(index, 1)
    }
}

var Event = {
    /**
     * Appends an event handler to this object.
     * @param {String}   type The type, or name of the event to listen for. May also be an object who's property names are event names.
     * @param {Function} handler The method the event invokes.
     * @param {Object}   scope (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to the object which fired the event.</b>
     * @param {Object}   options (optional) An object containing handler configuration. This options to be passed back as last parameter to fn when the event fires.
     */
    on: function(type, fn, scope, o) {
        var config, ev
        if (typeof type === 'object') {
            o = type
            for (type in o) {
                if (!o.hasOwnProperty(type)) continue
                config = o[type]
                this.on(type, config.fn || config, config.scope || o.scope, config.fn ? config : o)
            }
        } else {
            this._events = this._events || {}
            ev = this._events[type] || false
            if (!ev) {
                ev = this._events[type] = new Observer(type, this)
            }
            ev.subscribe(fn, scope, o)
        }
    },
    /**
     * Removes an event handler.
     * @param {String}   type The type of event the handler was associated with.
     * @param {Function} fn The handler to remove. 
     * @param {Object}   scope (optional) The scope originally specified for the handler.
     */
    off: function(type, fn, scope) {
        var config, ev, o, index
        if (typeof type === 'object') {
            o = type
            for (type in o) {
                if (!o.hasOwnProperty(type)) continue
                config = o[type]
                this.un(type, config.fn || config, config.scope || o.scope)
            }
        } else {
            ev = this._events[type]
            if (ev) ev.unsubscribe(fn, scope)
        }
    },
    clearEvent: function(type) {
        var ev = this._events && this._events[type]
        if (ev) ev.clear()
    },
    /**
     * @param {String} type The type, or name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fire: function(type) {
        var ev
        if (!this._events || !(ev = this._events[type])) {
            return true
        }
        return ev.publish.apply(ev, slice.call(arguments, 1))
    },
    /**
     * Checks to see if this object has any listeners for a specified event
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */
    hasEvent: function(type) {
        var e = this._events && this._events[type]
        return typeof e === 'object' && e.listeners.length > 0
    }
}

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
    Constructor.toString = function() {return name}

    var proto = Constructor.prototype = new superClass()
    proto.constructor = factory
    var supr = superClass.prototype
    factory.call(proto, supr)
    
    mix(proto, Event)

    var obj = namespace(name, Class.globalNamespace)
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