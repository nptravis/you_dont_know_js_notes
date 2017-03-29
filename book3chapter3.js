
// Chapter 3: Objects 

//Literal Syntax
var myObj = {
	key: value,
	key2: value2
};

// Constructed Syntax
var myObj = new Object();
myObj.key = value;

// Almost always use the literal syntax.

// Type
// the 6 primary types of data in JS are:
// 1. string
// 2. number
// 3. boolean
// 4. null
// 5. undefined
// 6. object

// simple primitives(string, number, etc.) are not objects.
// Sub-types of objects are called complex primitives
// Functions are a sub-type of object (callable objects). 
// Arrays are also objects.

// Built in Objects
// String
// Number
// Boolean
// Object
// Function
// Array
// Date
// RegExp
// Error

var strPrimitive = "I am a string";
typeof strPrimitive; // "string"
strPrimitive instanceof String: // false

var strObject = new String("I am a string");
typeof strObject; // "object"
strObject instanceof String; // true

// inspect the object sub-type
Object.prototype.toString.call(strObject); // [object String]

// JS will automatically coerce string primitives into string objects when needed.

// Contents
var myObject = {
	a: 2
};

myObject.a; // 2, property access
myObject["a"]; // 2, key access

var wantA = true;
var myObject = {
	a: 2
};

var idx;

if(wantA) {
	idx = "a";
}
// later
console.log(myObject[idx]); // 2

// Property names are always strings, even numbers will be converted to a string
var myObject = {};

myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";

myObject["true"]; // 'foo'
myObject["3"]; // "bar"
myObject["[object Object"]; // "baz"

// Computed Property Names

var prefix = "foo";

var myObject = {
	[prefix + "bar"]: "hello", // computed property name
	[prefix + "baz"]: "world"
};

myObject["foobar"]; // hello
myObject["foobaz"]; // world

// Property vs. Method
// Functions never belong to objects
// Everytime you access a property on an object, that is property access.
function foo() {
	console.log("foo");
}

var someFoo = foo; // variable reference to 'foo'

var myObject = {
	someFoo: foo
};

foo; // function foo(){...}
someFoo; // function foo(){...}
myObject.someFoo; // function foo(){...}
// difference references to the same function, not a method
// safest concluscion is probably that "function" and "method" are interchangeable in JS

var myObject = {
	foo: function foo(){
		console.log("foo");
	}
};

var someFoo = myObject.foo;
someFoo; // function foo(){...}
myObject.foo; // function foo(){...}

// Arrays
var myArray = ["foo", 42, "bar"];
myArray.length; // 3
myArray[0]; //"foo"
myArray[2]; // "bar"

// Arrays are objects, you can add properties to them
var myArray = ["foo", 42, "bar"];
myArray.baz = "baz";
myArray.length; // 3
myArray.baz;// "baz"

// Careful how you add properties, can change indexed values
var myArray = ["foo", 42, "bar"];

myArray["3"] = "baz"; // Oops, just changed index 3

myArray.length; // 4
myArray[3]; // "baz"

// Duplicating Objects
function anotherFunction(){....}

var anotherObject = {
	c: true
};

var anotherArray = [];

var myObject = {
	a: 2,
	b: anotherObject, // reference, not a copy!
	c: anotherArray, // another reference
	d: anotherFunction
}

anotherArray.push(anotherObject, myObject);
// Shallow vs Deep copy
// Shallow copy would end up with a as a copy of the value 2, but b, c and d are just references
// Deep copy would duplicate not only myObject, but anotherObject and anotherArray. Since anotherArray makes refernce to anotherObject and myObject, creates an infinite circular reference.

var newObj = Object.assign({}, myObject);

newObj.a; // 2
newObj.b === anotherObject; // true
newObj.c === anotherArray; // true
newObj.d === anotherFunction; // true

// Property Descriptors

var myObject = {
	a: 2
};

Object.getOwnPropertyDescriptor(myObject, "a");
/* {
	value: 2,
	writeable: true,
	enumerable: true,
	configurable: true
} */
var myObject = {};

Object.defineProperty(myObject, "a", {
	value: 2,
	writeable: true,
	configurable: true,
	enumerable: true
});

myObject.a; // 2

// Writeable
// the ability to be able to change the value
var myObject = {};

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: false, // not writable!
	configurable: true,
	enumerable: true
} );

myObject.a = 3;

myObject.a; // 2

// Configurable
// the ability to modify its descriptor definition
var myObject = {
	a: 2
};

myObject.a = 3;
myObject.a;					// 3

Object.defineProperty( myObject, "a", {
	value: 4,
	writable: true,
	configurable: false,	// not configurable!
	enumerable: true
} );

myObject.a;					// 4
myObject.a = 5;
myObject.a;					// 5

Object.defineProperty( myObject, "a", {
	value: 6,
	writable: true,
	configurable: true,
	enumerable: true
} ); // TypeError

// Changing configurable to false is a one-way action, and cannot be undone!
// For some reason, if not-configurable can still change writeable from true to false, but not the other way around

var myObject = {
	a: 2
};

myObject.a;				// 2
delete myObject.a;
myObject.a;				// undefined

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: true,
	configurable: false,
	enumerable: true
} );

myObject.a;				// 2
delete myObject.a;
myObject.a;				// 2

// cannot delete!

// Enumerable

// Immutability


