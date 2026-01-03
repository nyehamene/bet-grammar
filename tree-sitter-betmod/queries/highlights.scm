; Punctuation
[
  "."
  ":"
  ";"
  "("
  ")"
] @punctuation.delimiter

; Keyword
[
  "@package"
  "@version"
  "@require"
  "@export"
] @keyword

; Literals
(string) @string
(number) @number
(boolean) @boolean
(comment) @comment
(escape_char) @constant.character.escape

; String template
; (string
;   (string_template_expr
;     (identifier) @variable))

; (string
;   (string_template_expr
;     (string) @string))

; Identifiers
(identifier) @variable
(member_access (identifier) @variable)

(const_declaration
  (identifier) @variable
  ":" @operator
  (member_access) @type
  ":" @operator)
