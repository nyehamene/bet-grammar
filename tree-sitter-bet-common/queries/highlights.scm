; Keywords
[
  "enum"
  "component"
] @keyword

[
  "if"
  "cond"
] @keyword.directive

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
(identifier_dot) @variable.other.member
(identifier_dash) @variable
(identifier_blank) @variable
(identifier_builtin) @keyword
(keyword) @constant.character

(call
  name: (identifier) @function)

(call
  name: (identifier_dot) @function.builtin)

(call
  name: (identifier_dash) @ERROR)

; (call
;   name: (identifier_builtin) @function.builtin)

(member_access
   "." @operator)

(member_access
  member: (identifier) @variable.other.member)

(member_access
  member: (call
    name: (identifier) @function.method))

; Variables and Constants
(const_declaration
  name: (identifier) @variable.constant)

(const_declaration
  [":" "="] @operator)

(var_declaration
  name: (identifier) @variable)

(var_declaration
  [":" "="] @operator)

; Types
(const_declaration
  type: (type_identifier) @type)

(const_declaration
  type: (member_access
    member: (identifier) @type))

(var_declaration
  type: (type_identifier) @type)

(var_declaration
  type: (member_access
    member: (identifier) @type))

; Enum members
(enum_member
  (identifier) @constant)

(template_expression
  open: "\\{" @punctuation.delimiter)

(template_expression
  close: "}" @punctuation.delimiter)

; Comments
(comment_line) @comment
(comment_block) @comment.block

; Elements and Components

(component_element
  tag: (member_access
    member: (identifier)) @tag)

(component_element
  tag: (identifier) @tag)

(property
  name: (identifier) @variable.other.member)

(attribute
  name: (identifier) @attribute)

; CSS / Style

(css_property_declaration
  name: (identifier) @variable.other.member)

(css_function_call
  (identifier) @function.builtin)

(css_variable
  (identifier) @variable)

