if (typeof exports === 'object') { // node.js
	exports.Class = Class
} else if (typeof define === 'function' && define.amd) { // Expose IO to the global object or as AMD module
    // define.amd.Class = true
    Class.amd = true
    define('Class', [], function() { return Class } )
} else {
    // global.namespace = namespace
    global.Class = Class
}

}(this);