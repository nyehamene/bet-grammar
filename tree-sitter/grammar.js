module.exports = grammar({
    name: 'bet',

    extras: $ => [
        /\s/,
        $._comment,
    ],

    conflicts: $ => [
        [$._expr, $._basic_expr],
        [$._style_expr, $._basic_expr],
        [$._element_expr, $._basic_expr],
        [$._ident_q, $.member_access],
    ],

    rules: {
        source_file: $ => choice(
            $.work_file,
            $.mod_file,
            $.bet_file
        ),

        // From source.grammar
        work_file: $ => repeat1($._dir_stmt),
        mod_file: $ => repeat1($._mod_stmt),
        bet_file: $ => repeat1($.decl),

        // From work.grammar
        _dir_stmt: $ => seq('dir', $.string, ';'),

        // From mod.grammar
        _mod_stmt: $ => seq(
            choice(
                $.package_decl,
                $.version_stmt,
                $.require_stmt,
                $.export_stmt
            ),
            ';'
        ),

        package_decl: $ => seq(
            optional(seq($.ident, ':', optional(alias($._package_keyword, $.keyword)), ':')),
            $._package_builtin
        ),
        _package_builtin: $ => seq('@package', '(', $.string, ')'),
        version_stmt: $ => seq(alias($._version_keyword, $.keyword), $.string),
        require_stmt: $ => seq(alias($._require_keyword, $.keyword), $._argument_list),
        export_stmt: $ => seq(alias($._export_keyword, $.keyword), $._argument_list),

        _argument_list: $ => choice(
            $._argument,
            $._argument_group
        ),
        _argument_group: $ => seq('(', repeat($._argument), ')'),
        _argument: $ => seq(choice($.member_access, $.many_member_access), optional(';')),

        many_member_access: $ => seq($.member_access, '.', '*'),

        // From bet.grammar
        decl: $ => seq(
            field('name', $.ident),
            ':',
            field('type', $._ident_q),
            ':',
            field('value', $._expr),
            $._stmt_separator
        ),

        _stmt_separator: $ => choice(';', '\n'),

        _expr: $ => choice(
            $.import_expr,
            $.enum_expr,
            $.component_expr,
            $.style_expr,
            $._basic_expr
        ),

        import_expr: $ => seq('@import', '(', choice($.string, alias($._package_keyword, $.keyword)), ')'),

        enum_expr: $ => seq(alias($._enum_keyword, $.keyword), '{', repeat(seq($._enum_member, optional($._stmt_separator))), '}'),
        _enum_member: $ => seq($.ident, repeat(seq($._stmt_separator, $.ident))),

        component_expr: $ => seq(alias($._component_keyword, $.keyword), '{', $._component_body, '}'),
        _component_body: $ => seq(repeat($._component_field), repeat($.element)),
        _component_field: $ => seq(
            field('name', $.ident),
            ':',
            field('type', $._ident_q),
            optional(seq('=', field('value', $._basic_expr))),
            $._stmt_separator
        ),

        style_expr: $ => $.style,

        // From util/element.grammar
        element: $ => choice(
            $.string_element,
            $.if_element,
            $.cond_element,
            $.component_element
        ),
        string_element: $ => choice($.string, $._string_t, $._string_group),

        if_element: $ => seq('(', 'if', $._expr, $.element, optional($.element), ')'),

        cond_element: $ => seq('(', 'cond', $._basic_expr, repeat1($._cond_case), ')'),
        _cond_case: $ => seq($._basic_expr, $.element),

        component_element: $ => seq(
            '(',
            $._ident_q,
            optional($._property_list),
            optional($._attribute_list),
            repeat($.element),
            ')'
        ),

        _property_list: $ => seq('[', optional($._properties), ']'),
        _properties: $ => seq($.property, repeat(seq(',', $.property))),
        property: $ => seq(field('name', $.ident), field('value', $._property_value)),
        _property_value: $ => $._expr,

        _attribute_list: $ => seq('{', optional($._attrs), '}'),
        _attrs: $ => seq($.attr, repeat(seq(',', $.attr))),
        attr: $ => seq(field('name', $.ident), field('value', $._attr_value)),
        _attr_value: $ => $._expr,

        _element_expr: $ => choice(
            $._basic_expr,
            $._string_group,
            $.if_expr,
            $.cond_expr
        ),

        if_expr: $ => seq('(', 'if', $._expr, $._expr, optional($._expr), ')'),

        cond_expr: $ => seq('(', 'cond', $._basic_expr, repeat1($._cond_expr_case), ')'),
        _cond_expr_case: $ => seq($._basic_expr, $._expr),

        // From util/style.grammar
        style: $ => seq(alias($._style_keyword, $.keyword), $._rule),
        _rule: $ => choice($.style_block, $._at_rule),
        style_block: $ => seq('{', repeat($._style_rule), '}'),
        _style_rule: $ => seq($._decl, ';'),
        _decl: $ => choice($.style_decl, $._at_rule, $._style_nesting),

        _style_nesting: $ => seq(choice($.selector_list, $.percentage), $.style_block),

        _at_rule: $ => seq('@', $.style_ident, repeat($._prelude), optional($.style_block)),

        _prelude: $ => $._prelude_value,
        _prelude_value: $ => choice(
            $.style_ident, $.string, $.number, $.size, $.percentage, $.function_call, $._paren_prelude_value, $._prelude_list, $._paren_decl
        ),
        _paren_prelude_value: $ => seq('(', $._prelude_value, ')'),
        _prelude_list: $ => seq($._prelude_value, repeat(seq(optional(','), $._prelude_value))),

        _selector: $ => seq($._simple_selector, repeat(seq($._combinator, $._simple_selector))),
        _simple_selector: $ => choice($.type_selector, $.class_selector, $.id_selector, $._attr_selector, $._pseudo_class_selector, $._pseudo_element_selector, $.nesting_selector),
        selector_list: $ => seq($._selector, repeat(seq(',', $._selector))),
        type_selector: $ => $.style_ident,
        class_selector: $ => $._ident_d,
        id_selector: $ => seq('#', $.style_ident),
        nesting_selector: $ => '&',
        _attr_selector: $ => seq('[', $._attr_selector_value, ']'),
        _attr_selector_value: $ => choice(
            seq($.style_ident, $._attr_selector_op, $._basic_expr, optional($._attr_selector_mod)),
            $.style_ident
        ),
        _attr_selector_op: $ => seq(optional(choice('~', '|', '^', '$', '*')), '='),
        _attr_selector_mod: $ => choice('i', 'I', 's', 'S'),

        _pseudo_class_selector: $ => seq(':', $.style_ident, optional(seq('(', optional($.selector_list), ')'))),
        _pseudo_element_selector: $ => seq('::', $.style_ident, optional(seq('(', optional($.selector_list), ')'))),

        _combinator: $ => choice('>', '+', '!', '~', ' '),

        style_decl: $ => seq($.style_ident, ':', $._style_expr),

        _paren_decl: $ => seq('(', $._decl, repeat(seq(choice(',', ';'), $._decl)), ')'),

        _style_expr: $ => choice($._basic_expr, $.color, $._calc, $._list, $._url, $._paren_expr, $._function_call),

        _calc: $ => seq('calc', '(', $._calc_expr, ')'),
        _calc_expr: $ => choice($._basic_expr, $._binary_expr, $._unary_expr),
        _url: $ => seq('url', '(', choice($.string, $.variable), ')'),
        variable: $ => seq('var', '(', $.style_ident, ')'),
        _function_call: $ => seq($.style_ident, '(', $._style_expr, ')'),
        _binary_expr: $ => seq($._basic_expr, repeat1(seq(choice('+', '-', '*', '/'), $._basic_expr))),
        _unary_expr: $ => seq(choice('+', '-'), $._style_expr),
        _paren_expr: $ => seq('(', $._style_expr, ')'),

        _list: $ => seq($._style_expr, repeat(seq(optional(','), $._style_expr))),

        color: $ => choice($._color_hex, $._color_rgb, $._color_hsl, alias($._current_color_keyword, $.keyword)),
        _color_hsl: $ => seq(alias($._hsl_keyword, $.keyword), '(', $._style_expr, ')'),
        _color_rgb: $ => seq(alias($._rgb_keyword, $.keyword), '(', $._style_expr, ')'),
        _color_hex: $ => seq('#', repeat1(/[a-fA-F0-9]/)),

        percentage: $ => seq($.number, '%'),
        size: $ => seq($.number, $.style_ident),

        // From util/literals.grammar
        _bool: $ => choice(alias($._true_keyword, $.keyword), alias($._false_keyword, $.keyword)),
        _literal: $ => choice($.string, $.number, $._bool, $._ident_d),
        _basic_expr: $ => choice($.string, $.number, $._bool, $._ident_d, $._string_l, $._ident_q),


        ident: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
        style_ident: $ => /[a-zA-Z_-][a-zA-Z0-9_-]*/,

        _ident_d: $ => seq('.', $.ident),
        _ident_q: $ => choice($.ident, $.member_access),
        member_access: $ => seq($.ident, repeat1(seq('.', $.ident))),

        string: $ => seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"'),
        _string_l: $ => seq('\\', repeat(choice(/[^\n\\]+/, /\\./)), optional('\n')),

        _string_t: $ => seq('"', repeat(choice(/[^"{\\]+/, /\\./, $._string_template_expr)), '"'),
        _string_t_l: $ => seq('\\', repeat(choice(/[^\n{\\]+/, /\\./, $._string_template_expr)), optional('\n')),
        _string_template_expr: $ => seq('{', $._basic_expr, '}'),
        _string_group: $ => repeat1(choice($._string_l, $._string_t_l)),

        number: $ => choice($._number_dec, $._number_hex, $._number_bin),
        _number_dec: $ => /0|[1-9][0-9]*(\.[0-9]+)?/,
        _number_hex: $ => /0[xX][a-fA-F0-9]+/,
        _number_bin: $ => /0[bB][01]+/,

        // Keywords
        _package_keyword: $ => 'package',
        _version_keyword: $ => 'version',
        _require_keyword: $ => 'require',
        _export_keyword: $ => 'export',
        _enum_keyword: $ => 'enum',
        _component_keyword: $ => 'component',
        _style_keyword: $ => 'style',
        _current_color_keyword: $ => 'currentcolor',
        _hsl_keyword: $ => choice('hsl', 'hsla'),
        _rgb_keyword: $ => choice('rgb', 'rgba'),
        _true_keyword: $ => 'true',
        _false_keyword: $ => 'false',

        // Comment
        _comment: $ => choice(
            token(seq('//', /[^\n]*/)),
            token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))
        )
    }
});
