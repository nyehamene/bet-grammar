; Keywords
"dir" @keyword
"::" @operator

; Literals
(string) @string
(string_line_group) @string
(number) @number
(boolean) @boolean
(comment) @comment

; Identifiers
(identifier) @identifier
(member_access (identifier) @identifier)
(var_statement (identifier) @variable)