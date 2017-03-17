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

		  // Hard Binding
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

		  












