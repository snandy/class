// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    // define.amd.Class = true
    Class.amd = true
    define('Class', [], function() { return Class } )
} else {
    // global.namespace = namespace
    global.Class = Class
}

}(this);