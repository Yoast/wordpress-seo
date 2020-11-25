import Tokenizr, { IToken } from "tokenizr";

const lexer = new Tokenizr();

lexer.rule( "default", /(.*?)({{[a-zA-Z-]+|$)/, ( ctx, matches ) => {
	if ( matches[ 1 ] && matches[ 1 ].length > 0 ) {
		ctx.accept( "constant", matches[ 1 ] );
	}

	if ( matches[ 2 ] && matches[ 2 ].slice( 0, 2 ) === "{{" ) {
		ctx.state( "definition" );
		ctx.accept( "definition", matches[ 2 ].slice( 2 ) );
		ctx.data( "nested", [] );
	}
}, "open-instruction" );

lexer.rule( "definition", /\s*}}/, ( ctx ) => {
	ctx.untag( "undefined" );
	ctx.state( "default" );
	ctx.ignore();
}, "close-instruction" );

// Options object key
lexer.rule( "definition", /\s*([a-zA-Z][a-zA-Z0-9-_]*)=/, ( ctx, matches ) => {
	ctx.accept( "key", matches[ 1 ] );
	ctx.state( "definition-value" );
}, "options-object-key" );

// Empty object
lexer.rule( "definition-value", /\s*\{\s*}/, ctx => {
	ctx.accept( "empty-object" );
	if ( ! ctx.tagged( "array" ) && ! ctx.tagged( "object" ) ) {
		ctx.state( "definition" );
	}
}, "empty-object" );

// Open object
lexer.rule( "definition-value", /\s*\{/, ( ctx ) => {
	ctx.tag( "object" );
	ctx.accept( "object-open" );
	ctx.state( "definition-key" );

	const nested = ctx.data( "nested" ) as string[];
	nested.push( "object" );
	ctx.data( "nested", nested );

	if ( ctx.tagged( "array" ) ) {
		ctx.untag( "array" );
	}
}, "open-object" );

// Close object
lexer.rule( "definition-value #object", /\s*}/, ( ctx ) => {
	const nested = ctx.data( "nested" ) as string[];
	nested.pop();
	ctx.data( "nested", nested );

	ctx.accept( "object-close" );
	if ( nested.length === 0 ) {
		ctx.untag( "object" );
		ctx.state( "definition" );
		return;
	}
	const next = nested[ nested.length - 1 ];
	if ( next === "array" ) {
		ctx.untag( "object" );
		ctx.tag( "array" );
	}
}, "close-object" );

// Object keys
lexer.rule( "definition-key #object", /\s*"([^"\\]+|\\.)*":/, ( ctx, matches ) => {
	ctx.accept( "key", matches[ 1 ] );
	ctx.state( "definition-value" );
}, "object-key" );

// Comma in object
lexer.rule( "definition-value #object", /\s*,/, ( ctx ) => {
	ctx.state( "definition-key" );
	ctx.ignore();
}, "object-comma" );

// Open array
lexer.rule( "definition-value", /\s*\[/, ( ctx ) => {
	ctx.tag( "array" );
	ctx.accept( "array-open" );

	const nested = ctx.data( "nested" ) as string[];
	nested.push( "array" );
	ctx.data( "nested", nested );

	if ( ctx.tagged( "object" ) ) {
		ctx.untag( "object" );
	}
}, "open-array" );

// {{instruction option1=[1,2,{ foo: "bar" }] option2=true}}

// Close array
lexer.rule( "definition-value #array", /\s*]/, ( ctx ) => {
	const nested = ctx.data( "nested" ) as string[];
	nested.pop();
	ctx.data( "nested", nested );

	ctx.accept( "array-close" );
	if ( nested.length === 0 ) {
		ctx.untag( "array" );
		ctx.state( "definition" );
		return;
	}
	const next = nested[ nested.length - 1 ];
	if ( next === "object" ) {
		ctx.untag( "array" );
		ctx.tag( "object" );
	}
}, "close-array" );

// Comma in array
lexer.rule( "definition-value #array", /\s*,/, ( ctx ) => {
	ctx.ignore();
}, "array-comma" );

// Number values
lexer.rule( "definition-value", /\s*(\d+)/, ( ctx, matches ) => {
	ctx.accept( "value", parseInt( matches[ 1 ], 10 ) );
	if ( ! ctx.tagged( "array" ) && ! ctx.tagged( "object" ) ) {
		ctx.state( "definition" );
	}
}, "number-value" );

// Boolean values
lexer.rule( "definition-value", /\s*(true|false)/, ( ctx, matches ) => {
	ctx.accept( "value", matches[ 1 ] === "true" );
	if ( ! ctx.tagged( "array" ) && ! ctx.tagged( "object" ) ) {
		ctx.state( "definition" );
	}
}, "boolean-value" );

// String values
lexer.rule( "definition-value", /\s*"([^"\\]+|\\.)*"/, ( ctx, matches ) => {
	ctx.accept( "value", matches[ 1 ] );
	if ( ! ctx.tagged( "array" ) && ! ctx.tagged( "object" ) ) {
		ctx.state( "definition" );
	}
}, "string-value" );

/**
 * Tokenizes a given text.
 *
 * @param text The text.
 *
 * @returns An array of tokens.
 */
export default function tokenize( text: string ): IToken[] {
	lexer.reset();
	lexer.input( text );
	return lexer.tokens();
}
