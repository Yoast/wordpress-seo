import { parseSync } from "@babel/core";
import rule from "../../eslint-rules/border-requires-style";

/**
 * Runs the rule on a JSX snippet with a minimal ESLint context.
 *
 * ESLint 9's RuleTester cannot load under this repo's Jest version, so the rule is driven directly on an ESTree AST.
 *
 * @param {string} code The JSX code.
 *
 * @returns {{reports: Object[], output: string|null}} The reports and the code after applying the fixes.
 */
const run = ( code ) => {
	const ast = parseSync( code, { babelrc: false, configFile: false, parserOpts: { plugins: [ "jsx", "estree" ] } } );
	const reports = [];
	const context = {
		sourceCode: { getText: ( node ) => code.slice( node.start, node.end ) },
		report: ( report ) => reports.push( report ),
	};
	const { JSXAttribute: onAttribute } = rule.create( context );

	const visit = ( node ) => {
		if ( ! node || typeof node.type !== "string" ) {
			return;
		}
		if ( node.type === "JSXAttribute" ) {
			onAttribute( node );
		}
		Object.values( node ).forEach( ( child ) => {
			if ( Array.isArray( child ) ) {
				child.forEach( visit );
			} else if ( child && typeof child.type === "string" ) {
				visit( child );
			}
		} );
	};
	visit( ast.program );

	// Apply the fixes from the end, so earlier offsets stay valid.
	let output = null;
	reports.filter( ( report ) => report.fix ).sort( ( a, b ) => b.node.start - a.node.start ).forEach( ( report ) => {
		report.fix( {
			replaceText: ( node, text ) => {
				const source = output ?? code;
				output = source.slice( 0, node.start ) + text + source.slice( node.end );
			},
		} );
	} );
	return { reports, output };
};

describe( "border-requires-style", () => {
	it.each( [
		"<div className=\"yst-border yst-border-solid\" />",
		"<div className=\"yst-border-2 yst-border-dashed\" />",
		"<div className=\"yst-border-0\" />",
		"<div className=\"yst-border-slate-200 yst-rounded\" />",
		"<div className={ classNames( \"yst-border-solid\", isActive ? \"yst-border\" : \"yst-border-2\" ) } />",
		"<div className={ classNames( { \"yst-border yst-border-solid\": isActive } ) } />",
		"<div className=\"md:yst-border-2 yst-border-solid\" />",
		"<div className=\"hover:yst-border hover:yst-border-solid\" />",
		"<div className=\"yst-border-[#e5e7eb]\" />",
		"<div className=\"yst-border-t-[color:var(--border-color)]\" />",
		"<div className={ mode === \"yst-border\" ? \"yst-p-4\" : \"yst-p-2\" } />",
		"<div className={ variants[ \"yst-border\" ] } />",
		"<div className=\"yst-p-4\" />",
		"<div title=\"yst-border\" />",
	] )( "accepts %s", ( code ) => {
		expect( run( code ).reports ).toHaveLength( 0 );
	} );

	it( "reports a width utility without a style and appends yst-border-solid", () => {
		const { reports, output } = run( "<div className=\"yst-border yst-border-slate-200\" />" );

		expect( reports ).toHaveLength( 1 );
		expect( reports[ 0 ].data.width ).toBe( "yst-border" );
		expect( output ).toBe( "<div className=\"yst-border yst-border-slate-200 yst-border-solid\" />" );
	} );

	it( "fixes the string that holds a variant-prefixed width inside classNames()", () => {
		const { reports, output } = run( "<div className={ classNames( \"yst-p-4\", \"md:yst-border-b-2\" ) } />" );

		expect( reports[ 0 ].data.width ).toBe( "md:yst-border-b-2" );
		expect( output ).toBe( "<div className={ classNames( \"yst-p-4\", \"md:yst-border-b-2 yst-border-solid\" ) } />" );
	} );

	it( "reports a width inside a template literal without fixing it", () => {
		const { reports, output } = run( "<div className={ `yst-border-x ${ extra }` } />" );

		expect( reports[ 0 ].data.width ).toBe( "yst-border-x" );
		expect( reports[ 0 ].fix ).toBeNull();
		expect( output ).toBeNull();
	} );

	it.each( [
		[ "<div className=\"yst-border-[2px]\" />", "yst-border-[2px]" ],
		[ "<div className=\"yst-border hover:yst-border-solid\" />", "yst-border" ],
		[ "<div className={ classNames( \"yst-border-t\", isActive && \"yst-border-solid\" ) } />", "yst-border-t" ],
	] )( "reports %s", ( code, width ) => {
		const { reports } = run( code );

		expect( reports ).toHaveLength( 1 );
		expect( reports[ 0 ].data.width ).toBe( width );
	} );

	it( "checks each branch of a condition on its own", () => {
		const { reports, output } = run( "<div className={ active ? \"yst-border yst-border-solid\" : \"yst-border-2\" } />" );

		expect( reports ).toHaveLength( 1 );
		expect( reports[ 0 ].data.width ).toBe( "yst-border-2" );
		expect( output ).toBe( "<div className={ active ? \"yst-border yst-border-solid\" : \"yst-border-2 yst-border-solid\" } />" );
	} );

	it( "fixes a class name used as an object key", () => {
		const { output } = run( "<div className={ classNames( { \"yst-border\": isActive } ) } />" );

		expect( output ).toBe( "<div className={ classNames( { \"yst-border yst-border-solid\": isActive } ) } />" );
	} );

	it( "keeps escapes in the fixed string as written", () => {
		const { output } = run( "<div className={ \"yst-border after:yst-content-['a\\\"b']\" } />" );

		expect( output ).toBe( "<div className={ \"yst-border after:yst-content-['a\\\"b'] yst-border-solid\" } />" );
	} );

	it( "keeps the separator before a concatenated class", () => {
		const { output } = run( "<div className={ \"yst-border \" + extra } />" );

		expect( output ).toBe( "<div className={ \"yst-border yst-border-solid \" + extra } />" );
	} );
} );
