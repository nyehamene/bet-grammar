; Keywords
[
  "component"
  "style"
  "enum"
] @keyword

[
  "@import"
  "@document"
] @keyword.directive

[
  "if"
  "cond"
] @keyword.control.conditional

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


"\\{" @none

; Literals
(string) @string
(string_line) @string
(escape_char) @constant.character.escape
(number) @number
(size) @number
(percentage) @number
(bool) @boolean
(color) @constant.builtin
(identifier) @variable
(identifier_dot) @variable
(keyword) @constant.character

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
  tag: (_) @tag)
(component_element
  tag: (identifier) @tag)
(component_element
  tag: (member_access) @tag)

(property
  name: (identifier) @variable.other.member)

(attribute
  name: (identifier) @attribute)

; Enum members
(enum_member
  (identifier) @constant)

; CSS / Style
(css_property_declaration
  name: (identifier) @variable.other.member)

(function_call
  (identifier) @function.builtin)

(url) @string.special.uri

(variable
  (identifier) @variable)

(template_expression
  open: "\\{" @punctuation.delimiter)
(template_expression
  close: "}" @punctuation.delimiter)

; Comments
(comment) @comment
(block_comment) @comment
