Class
=====

Small, fast, elegant, powerful, and cross platform JavaScript OOP library. Support class, inheritance, namespace, private and more.


## Class API

+ Define a single class
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