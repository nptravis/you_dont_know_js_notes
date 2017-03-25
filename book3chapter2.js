// Chapter 2: 'this' all makes sense now! ////////////////////////////////////////

// call-site
// The location where a function is called, not declared. The call site must be inspected to understand what 'this' is a reference to. 
// Call-stack - the stack of functions that bave been called to get us to the current moment in execution.

function baz() {
	// call-stack is: 'baz'
	// so, our call-site is in the global scope

	console.log("baz");
	bar(); // call-site for 'bar'
}

function bar() {
	// call-stack is: 'baz' --> 'bar'
	// so, our call-site is in 'baz'

	console.log("bar");
	foo(); // call-site for 'foo'
}

function foo() {
	// call-stack is: 'baz' --> 'bar' --> 'foo'
	// so, our call-site is in 'bar'

	console.log("foo");
}

baz(); // call-site for 'baz'

// call-site, not call stack, is the only thing that matters for a 'this' binding.
// Can use a browsers JS debugger to find the call-stack

// Nothing but Rules
// To determine how the call-site points to 'this', we must examine 4 rules:
		
		// 1. Default Binding
			// stand alone function invocation - default catch all rule when no other rules apply
			function foo() {
				console.log(this.a);
			}

			var a = 2;

			foo(); // 2

			// Note: variables declared in the global scope are synonymous with the global-object property of the same name. They are not copies of each other, they are each other. Two sides of the same coin.

			// Doesn't work in strict mode, because the global-object is not eligible:
			function foo() {
				"use strict";
				console.log(this.a);
			}
			var a = 2;
			foo(); // TypeError: 'this' is 'undefined'

			// Only matters if the contents of the function are in strict mode, not if the call-site is in strict mode:

			function foo() {
				console.log(this.a);
			}

			var a = 2;

			(function(){
				"use strict";

				foo(); // 2
			})();

		// 2. Implicit Binding
			// The call-site is inside a context object, also referred to as an owning or containing object

			function foo() {
				console.log(this.a);
			}

			var obj = {
				a: 2,
				foo: foo
			};

			obj.foo(); // 2
			// when there is a context object for a function reference, the implicit binding rule says it's that object which should be used for the function call's 'this' binding. Therefore, this.a is the same as obj.a

			// Now, only the top/last level of an object property reference chain matters to the call-site:
			
			function foo() {
				console.log(this.a);
			}

			var obj2 = {
				a: 42,
				foo: foo
			};

			var obj1 = {
				a: 2,
				obj2: obj2
			};

			obj1.obj2.foo(); // 42

				// Implicity Lost

				function foo(){
					console.log(this.a);
				}

				var obj = {
					a: 2,
					foo: foo
				};

				var bar = obj.foo; // function reference/alias !

				var a = "oops, global"; // 'a' also property on global object

				bar(); // "oops, global"

				// even though bar looks to be referencing obj.foo, it is just referencing foo itself. And since the call-site, bar();, is just a simple plain undecorated call, it defaults to default binding rules. 


				// Another common way to lose implicit binding is when passing a callback function:
				function foo() {
					console.log(this.a);
				}

				function doFoo(fn) {
					// 'fn' is just another reference to 'foo'
					fn();
				}

				var obj = {
					a: 2,
					foo: foo
				};

				var a = "oops, global"; // 'a' also a property global object

				doFoo(obj.foo); // "oops, global"

				// If the function your passing your callback to is a built-in function, get same result:
				function foo() {
					console.log(this.a);
				}

				var obj = {
					a: 2,
					foo: foo
				}

				var a = "oops, global";
				setTimeout(obj.foo, 100); // "oops, global"

				//THink of this built in function as normal function:
				function setTimeout(fn, delay){
					// wait for 'delay' milliseconds
					fn(); // <-- call site!
				}

				// It's quite common that function callbacks lose their binding. 

		// 3. Explicit Binding
		 // Almost all functions, but definitely the ones you create, have some utilities available to them (via their Prototype), such as call(..) and apply(...)

		 function foo() {
		 	console.log(this.a);
		 }

		 var obj = {
		 	a: 2
		 };

		 foo.call(obj); // 2

		 //foo.call(...) forces 'this' to be obj. 
		 // apply(...) will behave the same way if used like this.
		 // If you pass a simple primtive value(string, boolean, number) as the 'this' binding, it will be wrapped in it's object form (new String(..), new Boolean(..), new Number(..)). Referred to as 'boxing'

		// 3. Hard Binding
		  // Can be used to avoid losing binding due to callbacks

		  function foo() {
		  	console.log(this.a);
		  }

		  var obj = {
		  	a: 2
		  };

		  var bar = function() {
		  	foo.call(obj);
		  }

		  bar(); // 2
		  setTimeout(bar, 100); // 2

		  // 'bar' hard binds foo's 'this' to obj

		  // Typical way to wrap a function with a hard binding creates a pass-thru of any arguments and any return value

		  function foo(something) {
		  	console.log(this.a, something);
		  	return this.a + something;
		  }

		  var obj = {
		  	a: 2
		  };

		  var bar = function() {
		  	return foo.apply(obj, arguments);
		  }

		  var b = bar(3); // 2 3
		  console.log(b); // 5

		  // Can also create a usable 'bind' helper

		  function foo(something) {
		  	console.log(this.a, something);
		  	return this.a + something;
		  }

		  // simple 'bind' helper
		  function bind(fn, obj) {
		  	return function(){
		  		return fn.apply(obj, arguments);
		  	};

		  }

		  var obj = {
		  	a: 2
		  };

		  var bar = bind(foo, obj);
		  var b = bar(3); // 2 3 
		  console.log(b); // 5

		  // Since hard binding is so common, ES5 has a built in utility for it: Function.Prototype.bind:

		  function foo(something) {
		  	console.log(this.a, something);
		  	return this.a + something;
		  }

		  var obj = {
		  	a: 2
		  }

		  var bar = foo.bind(obj); // acts just like our helper before

		  var b = bar(3); // 2 3
		  console.log(b); // 5

		  // Note: ES6 gives the bind utility a .name property, so for bar = foo.bind(..) would show up as "bound foo" in a stack trace

		  // API Call "Contexts"
		  // designed as a work around not not use bind(..), but also ensures callback function uses a particular 'this'

		  function foo(el) {
		  	console.log(el, this.id);
		  }

		  var obj = {
		  	id: "awesome"
		  };

		  // use 'obj' as 'this' for 'foo(..)' calls
		  [1,2,3].forEach(foo, obj); // 1 awesome, 2 awesome, 3 awesome

		// 4. 'new' Binding
		// Constructors are special methods attached to classes, called by using the 'new' operator
		something = new MyClass(...);

		// when a function is invoked with 'new' in front of it, a constructor call, the following things are done automatically:
		// 1. a brand new object is created (aka, constructed) out of thin air
		// 2. the newly constructed object is Prototype linked
		// 3. the newly contructed object is set as the 'this' binding for that function call
		// 4. unless the function returns its own alternate object, the new-invoked function call will automatically return the newly constructed object

		function foo(a) {
			this.a = a;
		}

		var bar = new foo(2);
		console.log(bar.a); // 2

		// by using 'new' in front of the foo() invokation, it sets bar to be bound as foo()'s 'this'. 

	// Everything in Order
	// The binding rules have heirachy is more than one is present.
	function foo() {
		console.log(this.a);
	}

	var obj1 = {
		a: 2,
		foo: foo
	};

	var obj2 = {
		a: 3,
		foo: foo
	};

	obj1.foo(); // 2
	obj2.foo(); // 3

	obj1.foo.call(obj2); // 3
	obj2.foo.call(obj1); // 2

	// so, explicit binding takes place over implicit binding. So, check for explicit binding first.

	function foo(something){
		this.a = something;
	}
  
  var obj1 = {
  	foo: foo
  };

  var obj2 = {};

  obj1.foo(2);
  console.log(obj1.a); // 2

  obj1.foo.call(obj2, 3); // 2
  console.log(obj2.a); // 3

  var bar = new obj1.foo(4);
  console.log(obj1.a) // 2
  console.log(bar.a) // 4

  // Therefore, 'new' binding takes precident over implicit binding.
  // Also, new binding takes precedent over hard binding:

  function foo(something) {
  	this.a = something;
  }

  var obj1 = {};

  var bar = foo.bind(obj1);
  bar(2);
  console.log(obj1.a); // 2

  var baz = new bar(3);
  console.log(obj1.a); // 2
  console.log(baz.a); // 3

  // why is new overriding hard binding useful? To create a function that contstucts objects that ignores the 'this' hard binding but presets some or all of the other function's arguments.

  function foo(p1,p2) {
  	this.val = p1 + p2;
  }

  // using null here because we don't care about the 'this' hard-binding, and it will be overridden by the 'new' call anyway
  var bar = foo.bind(null, 'p1'); // other arguments after first 'this' binding are arguments for the function
  var baz = new bar('p2');
  baz.val; // p1p2

  // Determining 'this'
  // Summary of rules for determing 'this' from a function's call-site. Ask these questions in order, and stop when the first rule applies

  // 1. New Binding - Is the function called with a 'new' binding? If so, 'this' is the newly constructed object:
  var bar = new foo(); // 'this' is bound to bar

  // 2. Explicit Binding - Is the function called with 'call' or 'apply', even hidden inside a 'bind' hard binding? If so, 'this' is the explicitly specified object.
  var bar = foo.call(obj2) // 'this' is bound to obj2

  // 3. Implicit Binding - is the function called with a context, otherwise known as an owing or containing object? If so, 'this' is that context object.
  var bar = obj1.foo() // 'this' is bound to obj1

  // 4. Default Binding - if in strict mode, pick undefined, otherwise pick the global object.
  var bar = foo() // 'this' is bound to bar

  // Binding Exceptions

  // Ignored 'this'
  // If you pass a null or undefined value for the this binding, it will defualt to default binding rules

  function foo() {
  	console.log(this.a);
  }

  var a = 2;

  foo.call(null); // 2

  // Common to use 'apply' for spreading out arrays of values as parameters to a function call. Similarly 'bind' can curry parameters (pre-set values), which can be very helpful. 

  function foo(a,b) {
  	console.log("a:" + a + ", b:" + b);
  }

  // spreading out arrays as parameters
  foo.apply(null, [2, 3]); // a:2, b:3

  // currying with 'bind'
  var bar = foo.bind(null, 2);
  bar(3); // a:2, b:3

  //Note: ES6 has a '...' spread operator which will let you syntactically do the same thing without 'apply':
  foo(...[1,2]) = foo(1,2) // these are the same.

  // However using a 'null' as the 'this' binding could crete problems, a third party library function makes a 'this' reference with your function for example, might create bad problems

  // Safer 'this'
  // Use a 'DMZ' object for the 'this' binding - an empty, non-delegated object
  function foo(a,b) {
  	console.log("a:" + a + "b:" + b);
  }

  // our DMZ object
  var ø = Object.create(null); // option + o

  // spreading out array as parameters
  foo.apply(ø, [2,3]); // a:2, b:3

  // currying with 'bind'
  var bar = foo.bind(ø, 2);
  bar(3); // a:2, b:3

  // Indirection
  // If you intentionally or not create an indirect reference to your function, then defualt binding rules will be evoked
  function foo() {
  	console.log(this.a);
  }

  var a = 2;
  var o = {a: 3, foo: foo};
  var p = {a:4};

  o.foo(); // 3
  (p.foo = o.foo)(); // 2

  // the result value is of p.foo = o.foo is just foo(), so defualt binding rules apply, if in strict mode be undefined

  // Softening Binding
  // a utility to check 'this' at call time and if it's global or undefined, uses a pre-specified alternate default(obj), otherwise the 'this' is left untouched. Also provides optional currying.

  if (!Function.prototype.softBind) {
	Function.prototype.softBind = function(obj) {
		var fn = this,
			curried = [].slice.call( arguments, 1 ),
			bound = function bound() {
				return fn.apply(
					(!this ||
						(typeof window !== "undefined" &&
							this === window) ||
						(typeof global !== "undefined" &&
							this === global)
					) ? obj : this,
					curried.concat.apply( curried, arguments )
				);
			};
		bound.prototype = Object.create( fn.prototype );
		return bound;
	};
}

// to demonstrate its usage: 

function foo() {
   console.log("name: " + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

var fooOBJ = foo.softBind( obj );

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2   <---- look!!!

fooOBJ.call( obj3 ); // name: obj3   <---- look!

setTimeout( obj2.foo, 10 ); // name: obj   <---- falls back to soft-binding

// Lexical 'this'
// arrow functions don't really use above 4 rules, it instead adopts the 'this' binding from the enclosing scope (function or global). Most common uses will come from event handlers or timers

function foo() {
	// return an arrow function
	return (a) => {
		// 'this' here is lexically adopted from 'foo()'
		console.log(this.a);
	};
}
var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call(obj1);
 
bar.call(obj2); // 2, not 3!

// here is another example:

function foo() {
	setTimeout(() => {
		// 'this' here is lexically scoped from foo()
		console.log(this.a);
	}, 100);
}

var obj = {
	a: 2
};

foo.call(obj); // 2

// the arrow function is to make 'this' lexically scoped, which can also be done pre ES6 like this:

function foo() {
	var self = this;
	setTimeout(function(){
		console.log(self.a);
	}, 100);
}

var obj = {
	a: 2
};

foo.call(obj); // 2

// arrow functions and self = this are defeating the actual intended functionality of 'this'. You can do it, but better to either avoid 'this' or use it for what it was intended.

// Review //////////////////////////////////////////////////////////////////////////////////////////
// Determinging the 'this' binding requires finding the direct call-site of that function. Once found, 4 rules can apply, in this order:
// 1. Called with new? Use the newly constructed object
// 2. Called with call or apply or bind? Use the specified object
// 3. Called with a context object owning the call? Use the context object
// 4. Default: undefined in strict mode, global object otherwise

// Be careful to mistakenly invoke the default binding rule, use a DMZ object in place of a null or undefined 'this' binding, like var ø = Object.create(null), to protect the global objects;

// ES6 introduces arrow functions which can lexify the this binding. Also, for pre-ES6 code, self = this can do the same. 

  
  
  
  
  















  











