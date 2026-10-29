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

	let output = null;
	reports.filter( ( report ) => report.fix ).forEach( ( report ) => {
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
		"<div className={ classNames( \"yst-border-t\", isActive && \"yst-border-solid\" ) } />",
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
} );
