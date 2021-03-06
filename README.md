## How to use

<pre>
// if you run node.js, or CommonJS-compliant system
var Class = require('Class')

// if you use Class in a browser with AMD (like RequireJS):
require(['Class'], function(Class) {
    // the same code that uses Class
})

// or when you define your own module:
define(['Class'], function(Class) {
    // your Class-using code goes here
})
</pre>

## API

#### Define a single class 'Person'
<pre>
Class('Person', function() {
    this.init = function(name) {
        this.name = name
    }
    this.getName = function() {
        return this.name
    }
    this.setName = function(name) {
        this.name = name
    }
    this.println = function() {
        alert('Name is ' + this.name)
    }
})
var p = new Person('John Backus')
console.log('Define a single class: ' + Person)
console.log('Create a instance of Person, his name is ' + p.getName())
</pre>

#### Define a class 'Man' which inherit Person
<pre>
Class('Man', Person, function(supr) {
    this.init = function(name, age) {
        // call super class constructor
        supr.init.call(this, name)
        this.age = age
    }
    this.getAge = function() {
        return this.age
    }
    this.setAge = function(age) {
        this.age = age
    }
    this.println = function() {
        alert('Name is ' + this.name + ', age is ' + this.age)
    }
})
var m1 = new Man('John McCarthy', 100)
m1.println()
</pre>

#### Define a namespace class 'App.model.Man'
<pre>
Class('App.model.Person', function() {
    this.init = function(name) {
        this.name = name
    }
    this.getName = function() {
        return this.name
    }
    this.setName = function(name) {
        this.name = name
    }
    this.println = function() {
        alert('Name is ' + this.name)
    }
})
var p = new App.model.Person('John Backus')
console.log('Create a instance of "App.model.Person", his name is ' + p.getName())
</pre>

#### Define a class with private
<pre>
Class('Person', function() {
    var privateVar = 'private vars'
    function privateFunc() {
        console.log(privateVar)
    }
    this.println = function() {
        privateFunc()
    }
})
var p = new Person()
p.println()
</pre>

#### Specify the global naming
<pre>
// The global naming
var Sohu = {}
Class.globalNamespace = Sohu

// define 'Sohu.Person'
Class('Person', function() {
    var privateVar = 'private vars'
    function privateFunc() {
        console.log(privateVar)
    }
    this.println = function() {
        privateFunc()
    }
})
var p = new Sohu.Person()
p.println()
</pre>

#### Add statics for a class
<pre>
Class.statics(Person, {
    prop1: 'xx',
    prop2: 'yy',
    method1: function() {xx},
    method2: function() {yy}
})
Person.prop1 // -》xx
Person.method1() // call static method
</pre>

#### Add methods for a class's prototype
<pre>
Class.methods(Person, {
    method1: function() {xx},
    method2: function() {yy}
})
var p1 = new Person('John', 29)
p1.method1()
p1.method2() 
</pre>

#### Mixin Classes
<pre>
var obj1 = {
    shout: function() {
        alert('I am a' + this.name)
    }
}
var obj2 = {
    setName: function(name) {
        this.name = name
    },
    setAge: function(age) {
        this.age = age
    }
}
Class('Person', function() {
    this.init = function(name, age) {
        this.name = name
        this.age = age
    }
})
Class.agument(Person, obj1, obj2)
</pre>

#### Custom event
<pre>
Class('Person', function() {
    this.init = function(name) {
        this.name = name
    }
    this.getName = function() {
        return this.name
    }
    this.setName = function(name) {
        this.name = name
    }
    this.println = function() {
        alert('Name is ' + this.name)
    }
})
var p = new Person('John Backus')
p.on('change', function(ev) {
    console.log(ev)
})

var num = 1;
document.onclick = function() {
    p.fire('change', 'clicked: ' + num++)
}  
</pre>

#### AMD Usage
<pre>
define('Person', ['Class'], function (Class) {
    return Class('Person', function() {
        this.init = function(name, age) {
            this.name = name
            this.age = age
        }
        this.getName = function() {}
        this.setName = function(name) {}
    })
})
</pre>