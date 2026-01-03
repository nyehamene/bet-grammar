// Basic const declaration
//--------------------
my_const : : "value"
// ^ variable
//            ^ string

// Const declaration with member access
//---------------------------------
my_const : parent.child : 123
// ^ variable
//             ^ type
//                        ^ number

// Built-ins
//----------
@package("my-package")
// ^ keyword
@version("1.0.0")
// ^ keyword
@require(pkg.foo)
// ^ keyword
@export(pkg.bar)
// ^ keyword

// Comment
//--------
// this is a comment
// ^ comment
