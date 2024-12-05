import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import jsxA11YPlugin from "eslint-plugin-jsx-a11y";
import jsdocPlugin from "eslint-plugin-jsdoc";
import nodePlugin from "eslint-plugin-n";
import importPlugin from "eslint-plugin-import";
import stylisticPlugin from "@stylistic/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	importPlugin.flatConfigs.recommended,
	{
		name: "yoast/recommended",
		plugins: {
			jsdoc: jsdocPlugin,
			stylistic: stylisticPlugin,
		},
		// https://eslint.org/docs/rules/
		rules: {
			// Native ESLint rules
			// - ESLint "Possible problems - These rules relate to possible logic errors in code:"
			// (https://eslint.org/docs/latest/rules/#possible-problems).
			"no-inner-declarations": [ "error", "functions" ],
			"no-self-compare": "error",
			"no-use-before-define": "error",

			// - ESLint "Suggestions - These rules suggest alternate ways of doing things:" (https://eslint.org/docs/latest/rules/#suggestions).
			"accessor-pairs": "error",
			camelcase: "error",
			complexity: [ "warn", 10 ],
			"consistent-this": "error",
			curly: "error",
			"dot-notation": "error",
			eqeqeq: "error",
			"guard-for-in": "error",
			"max-depth": "error",
			"max-nested-callbacks": "error",
			"max-statements": [ "warn", 30 ],
			"new-cap": "error",
			"no-alert": "error",
			"no-array-constructor": "error",
			"no-bitwise": "error",
			"no-caller": "error",
			"no-console": [ "warn", { allow: [ "warn", "error", "trace" ] } ],
			"no-div-regex": "error",
			"no-else-return": "error",
			"no-eq-null": "error",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-implied-eval": "error",
			"no-inline-comments": "error",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-loop-func": "error",
			"no-multi-str": "error",
			"no-negated-condition": "error",
			"no-nested-ternary": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-new": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-proto": "error",
			"no-restricted-syntax": [
				"error",
				{
					selector: "CallExpression[callee.name=/^(__)$/][arguments.length!=2]",
					message: "A textdomain needs to be provided for translation calls.",
				}, {
					selector: "CallExpression[callee.name=/^(_x)$/][arguments.length!=3]",
					message: "A textdomain needs to be provided for translation calls.",
				}, {
					selector: "CallExpression[callee.name=/^(_n)$/][arguments.length!=4]",
					message: "A textdomain needs to be provided for translation calls.",
				}, {
					selector: "CallExpression[callee.name=/^(_nx)$/][arguments.length!=5]",
					message: "A textdomain needs to be provided for translation calls.",
				},
			],
			"no-return-assign": "error",
			"no-script-url": "error",
			"no-shadow": [ "error", { builtinGlobals: false, hoist: "all", allow: [] } ],
			"no-undef-init": "error",
			"no-undefined": "error",
			"no-unneeded-ternary": "error",
			"no-unused-expressions": "error",
			"no-useless-call": "error",
			"no-useless-concat": "error",
			"no-void": "error",
			"no-warning-comments": [ "error", { terms: [ "todo" ], location: "anywhere" } ],
			"prefer-const": "error",
			radix: "error",
			strict: "error",

			// Plugin: Stylistic rules (https://eslint.style/packages/default).
			"stylistic/array-bracket-spacing": [ "error", "always" ],
			"stylistic/block-spacing": "error",
			"stylistic/brace-style": [ "error", "1tbs" ],
			"stylistic/comma-dangle": [ "error", "always-multiline" ],
			"stylistic/comma-spacing": "error",
			"stylistic/comma-style": "error",
			"stylistic/computed-property-spacing": [ "error", "always" ],
			"stylistic/eol-last": "error",
			"stylistic/func-call-spacing": "error",
			"stylistic/indent": [ "error", "tab", { SwitchCase: 1 } ],
			"stylistic/jsx-quotes": "error",
			"stylistic/key-spacing": "error",
			"stylistic/keyword-spacing": "error",
			"stylistic/linebreak-style": "error",
			"stylistic/max-len": [
				"error",
				{
					code: 150,
					tabWidth: 4,
					ignoreStrings: true,
				},
			],
			"stylistic/new-parens": "error",
			"stylistic/no-extra-semi": "error",
			"stylistic/no-mixed-spaces-and-tabs": [ "error", "smart-tabs" ],
			"stylistic/no-multiple-empty-lines": "error",
			"stylistic/no-trailing-spaces": "error",
			"stylistic/no-whitespace-before-property": "error",
			"stylistic/object-curly-spacing": [ "error", "always" ],
			"stylistic/operator-linebreak": "error",
			"stylistic/padded-blocks": [ "error", "never" ],
			"stylistic/quote-props": [ "error", "as-needed", { keywords: true } ],
			"stylistic/quotes": [ "error", "double", "avoid-escape" ],
			"stylistic/semi-spacing": "error",
			"stylistic/semi": "error",
			"stylistic/space-before-blocks": "error",
			"stylistic/space-before-function-paren": [ "error", "never" ],
			"stylistic/space-in-parens": [ "error", "always", { exceptions: [ "empty" ] } ],
			"stylistic/space-infix-ops": "error",
			"stylistic/space-unary-ops": [ "error", { words: false, nonwords: false, overrides: { "!": true } } ],
			"stylistic/spaced-comment": [ "error", "always" ],
			"stylistic/wrap-iife": "error",

			// Plugin: JSDoc rules (https://github.com/gajus/eslint-plugin-jsdoc)
			"jsdoc/require-jsdoc": [ "error", {
				require: {
					MethodDefinition: true,
					ClassDeclaration: true,
					ArrowFunctionExpression: false,
					FunctionExpression: false,
				},
				// The fixer only adds empty blocks, which are easy to forget to fill in.
				enableFixer: false,
				exemptEmptyFunctions: true,
			} ],
			"jsdoc/require-returns": "error",

			// Plugin: Import rules (https://github.com/import-js/eslint-plugin-import)
			"import/no-extraneous-dependencies": "error",
			"import/no-unresolved": "error",
		},
		settings: {
			jsdoc: {
				tagNamePreference: {
					"return": "returns",
					constant: "const",
				},
			},
		},
	},
	{
		files: [
			"**/*.{spec,test,tests}.{js,jsx,mjs,cjs,ts,tsx}",
			"{spec,test,tests}/**/*.{js,jsx,mjs,cjs,ts,tsx}",
		],
		languageOptions: {
			globals: {
				...globals.jest,
				...globals.node,
			},
		},
		rules: {
			// Some tests assert that a constructor throws an error, which is a valid use case.
			"no-new": "off",
		},
	},
	{
		files: [ "jest.config.{js,ts,cjs}" ],
		languageOptions: {
			globals: {
				...globals.commonjs,
			},
		},
	},
];

/** @type {import('eslint').Linter.Config[]} */
export const reactConfig = [
	reactPlugin.configs.flat.recommended,
	jsxA11YPlugin.flatConfigs.recommended,
	{
		name: "yoast/react",
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// Plugin: jsx-a11y rules (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y).
			// Deprecated in v6.1.0 in favor of label-has-associated-control but we still want to require only for/id and not nesting.
			"jsx-a11y/label-has-for": [ "error", { required: "id" } ],

			// Plugin: React rules (https://github.com/jsx-eslint/eslint-plugin-react)
			"react/boolean-prop-naming": "error",
			"react/button-has-type": 0,
			"react/default-props-match-prop-types": "error",
			"react/forbid-foreign-prop-types": "error",
			"react/jsx-boolean-value": [ "error", "always" ],
			"react/jsx-closing-bracket-location": [ "error", "line-aligned" ],
			"react/jsx-curly-spacing": [ "error", { when: "always", children: true } ],
			"react/jsx-equals-spacing": "error",
			"react/jsx-first-prop-new-line": [ "error", "multiline" ],
			"react/jsx-indent-props": [ "error", "tab" ],
			"react/jsx-indent": [ "error", "tab" ],
			"react/jsx-max-depth": [ "error", { max: 8 } ],
			"react/jsx-max-props-per-line": [ "error", { maximum: 6 } ],
			"react/jsx-no-bind": "error",
			"react/jsx-pascal-case": "error",
			"react/jsx-tag-spacing": [ "error", { beforeClosing: "never" } ],
			"react/no-access-state-in-setstate": "error",
			"react/no-redundant-should-component-update": "error",
			"react/no-render-return-value": "error",
			"react/no-this-in-sfc": "error",
			"react/no-typos": "error",
			"react/no-unused-prop-types": "error",
			"react/no-unused-state": "error",
			"react/prefer-es6-class": "error",
			"react/require-default-props": [ "error", { ignoreFunctionalComponents: true } ],
			"react/self-closing-comp": "error",
			"react/void-dom-elements-no-children": "error",
		},
	},
];

/** @type {import('eslint').Linter.Config[]} */
export const nodeConfig = [
	{
		name: "yoast/node",
		plugins: {
			node: nodePlugin,
		},
		rules: {
			// Plugin: Node rules (https://github.com/eslint-community/eslint-plugin-n)
			"node/callback-return": "error",
			"node/global-require": "error",
			"node/handle-callback-err": "error",
			"node/no-mixed-requires": "error",
			"node/no-path-concat": "error",
			"node/no-process-exit": "error",
		},
	},
];
