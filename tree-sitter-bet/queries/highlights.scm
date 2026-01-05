; Keywords
[
  "component"
  "style"
  "enum"
] @keyword

[
  "if"
  "cond"
] @keyword.control

"@import" @include

; Literals
(string) @string
(string_line) @string
(escape_char) @constant.character.escape
(number) @number
(size) @number
(percentage) @number
(bool) @boolean
(color) @constant.builtin ; Using constant.builtin for color literals like #ff0000

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ":"
  "="
  ","
  ";"
] @punctuation.delimiter

; Variables and Constants
(const_declaration
  name: (identifier) @variable.constant)

(var_declaration
  name: (identifier) @variable)

; Types
(const_declaration
  type: (_) @type)
(var_declaration
  type: (_) @type)

; Elements and Components
(component_element
  tag: (identifier) @tag)
(component_element
  tag: (member_access) @tag)

(property
  name: (identifier) @property)

(attribute
  name: (identifier) @attribute)

; Enum members
(enum_member
  (identifier) @constant)

; CSS / Style
(css_property_declaration
  name: (css_identifier) @property)

(function_call
  (css_identifier) @function.builtin)

(url) @string.special.uri

(variable
  (css_identifier) @variable)

(string_template_expr
  (identifier) @variable)

; Comments
(comment) @comment
