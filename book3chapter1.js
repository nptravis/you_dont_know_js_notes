

// Chapter 1: 'this' or That?

// The 'this' keyword is a special identifier that is automatically defined in the scope of every function.

// Why 'this'?
function identify() {
	return this.name.toUpperCase();
}

function speak() {
	var greeting = "Hello, I'm " + identify.call(this);
	console.log(greeting);
}

var me = {
	name: "Kyle"
};

var you = {
	name: "Reader"
};

identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello, I'm KYLE
speak.call(you); // Hello, I'm READER

// Now, this snippet can be written with a seperate argument instead of the 'this' keyword, like so:

function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify(context);
	console.log(greeting);
}

identify(you); // READER
speak(me); // Hello, I'm Kyle

// However, 'this' keyword is bit more elegant, and as your usage pattern gets more complex the 'this' becomes a cleaner choice. 

// Confusions
// Two meanings commonly attributed to the 'this' keyword that are incorrect are:

// Itself
   // state - values in properties
   function foo(num) {
   	console.log("foo: " + num);

   	// Keep track of how many times 'foo' is called
   	this.count++;
   }

  foo.count = 0;
  var i;
  for (i=0; i<10; i++) {
  	if (i > 5) {
  		foo(i);
  	}
  }
  // foo: 6
  // foo: 7
  // foo: 8
  // foo: 9

  // how many times was 'foo' called?
  console.log(foo.count); // 0 - wtf?

  // 'this'.count isn't referring to the object property of the foo() function at all, but rather a global count variable. At this point, alot of developers avoid using 'this' altogether and instead choose another way to store the count value, such as:

  function foo(num) {
  	console.log("foo: " + num);

  	// keep track
  	data.count++; // or could be foo.count++
  }

  var data = { // or could just be foo.count = 0;
  	count: 0
  };

  var i;
  for (i=0; i<10; i++) {
  	if (i > 5) {
  		foo(i);
  	}
  }
  // foo: 6
  // foo: 7
  // foo: 8
  // foo: 9

  // how many times was 'foo' called?
  console.log(data.count); // 4

  // This is just avoiding how to understand 'this'

  function foo() {
  	foo.count = 4; // 'foo' refers to itself
  }

  setTimeout (function (){
  	// anonymous function cannot refer to itself
  }, 10);

  // Note: an old a deprecated way to refer to the function object of an anonymous function was arguments.callee, but don't use this!

  function foo(num) {
  	console.log("foo: " + num);

  	// keeping track
  	// Note: 'this' IS actually 'foo' now, based on how 'foo' is called( see below)
  	this.count++;
  }

  foo.count = 0;

  var i;

  for (i=0; i<10, i++) {
  	if (i>5) {
  		// using call(), sets 'this' to point at the function foo itselft
  		foo.call(foo, i);
  	}
  }
  // foo: 6
  // foo: 7
  // foo: 8
  // foo: 9

  // how many times was 'foo' called?
  console.log(foo.count); // 4

  // This embraces 'this' instead of avoiding it

// Its Scope

// to be clear, 'this' does not refer to a function's lexical scope.

function foo() {
	var a = 2;
	this.bar();
}

function bar() {
 console.log(this.a);
}

foo(); // undefined

// This is a mistake. An attempt to access foo()'s scope, and grab it's varaible 'a'. No such bridge is possible. You cannot use 'this' to look up something in lexical scope. If you ever try to mix lexical scope with 'this', remember: There is no bridge!

// What's 'this'?
// It is not an author-time binding, but a runtime binding. 'this' binding has nothing to do with where a function is declared, but everything to do with how it is called. 

// Call-stack is a record that contains information about where the function was called from, how it was invoked, what parameters were passed, etc. One property of this record is the 'this' reference.

// Review ///////////////////////////////////////////////////////////////////////////////
// 'this' is commonly misunderstood, or omitted by developers
// You must first understand what 'this' is not:
  // It is not a reference to the function itself
  // It is not a reference to the functions lexical scope

// 'this' is a binding made when a function is invoked, what is references is determined entirely by the call-site where the function is called. 















