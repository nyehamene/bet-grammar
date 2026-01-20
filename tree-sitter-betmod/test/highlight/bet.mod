my_const : string : "value"
// ^ variable.constant
//         ^^^^^^ type
//                  ^ string

my_const : parent.child : 123
// < variable
//                ^^^^^ type
//                        ^ number

@package("my-package")
// ^ keyword
@version("1.0.0")
// ^ keyword
@require(pkg.foo)
// ^ keyword
@export(pkg.bar)
// ^ keyword

// this is a comment
// ^ comment
