/**
 * Requires a border style next to any `yst-border*` width utility in a `className`.
 *
 * Tailwind's preflight gives every element `border-style: solid`, but ours is scoped to `.yst-root`. Outside a
 * `.yst-root` ancestor the browser default `none` applies, so a width utility alone draws no border.
 * See docs/ui-library-without-root.md.
 */

// A border width utility, optionally behind variants: `yst-border`, `yst-border-2`, `yst-border-t`, `md:yst-border-x-4`.
const WIDTH = /^(?:[\w-]+:)*yst-border(?:-[trblxyse])?(?:-(\d+|\[[^\]]+\]))?$/;
const STYLE = /^(?:[\w-]+:)*yst-border-(?:solid|dashed|dotted|double|none|hidden)$/;

/**
 * Whether a node holds class names as text.
 *
 * @param {Object} node The AST node.
 *
 * @returns {boolean} True for string literals and template parts.
 */
const isString = ( node ) => ( node.type === "Literal" && typeof node.value === "string" ) || node.type === "TemplateElement";

/**
 * Returns the child nodes of an AST node.
 *
 * @param {Object} node The AST node.
 *
 * @returns {Object[]} The child nodes.
 */
const childrenOf = ( node ) => Object.keys( node )
	.filter( ( key ) => key !== "parent" )
	.flatMap( ( key ) => [].concat( node[ key ] ) )
	.filter( ( child ) => child && typeof child.type === "string" );

/**
 * Collects the string literals and template parts inside a `className` value.
 *
 * @param {Object} node The AST node.
 *
 * @returns {Object[]} The literal nodes.
 */
const collectStrings = ( node ) => ( isString( node ) ? [ node ] : childrenOf( node ).flatMap( collectStrings ) );

/**
 * Returns the class tokens of a literal or template part.
 *
 * @param {Object} node The literal or template element node.
 *
 * @returns {string[]} The tokens.
 */
const tokensOf = ( node ) => ( node.type === "Literal" ? node.value : node.value.cooked || "" ).split( /\s+/ ).filter( Boolean );

/**
 * Whether a token is a non-zero border width utility.
 *
 * @param {string} token The class token.
 *
 * @returns {boolean} True for e.g. `yst-border` or `yst-border-b-2`, false for `yst-border-0`.
 */
const isWidth = ( token ) => {
	const match = WIDTH.exec( token );
	return Boolean( match ) && match[ 1 ] !== "0";
};

/**
 * Whether a JSX attribute is a `className` with a value.
 *
 * @param {Object} attribute The JSX attribute node.
 *
 * @returns {boolean} True for `className="…"` and `className={ … }`.
 */
const isClassName = ( attribute ) => Boolean( attribute.value ) && attribute.name?.name === "className";

module.exports = {
	meta: {
		type: "problem",
		docs: {
			description: "Require a border style utility next to yst-border width utilities",
		},
		fixable: "code",
		schema: [],
		messages: {
			missingStyle: "`{{ width }}` draws no border outside a .yst-root ancestor; add `yst-border-solid`.",
		},
	},
	create( context ) {
		/**
		 * Appends `yst-border-solid` to a string literal.
		 *
		 * @param {Object} node The literal node.
		 *
		 * @returns {function} The fixer.
		 */
		const appendStyle = ( node ) => ( fixer ) => {
			const quote = context.sourceCode.getText( node )[ 0 ];
			return fixer.replaceText( node, quote + node.value.replace( /\s*$/, "" ) + " yst-border-solid" + quote );
		};

		return {
			JSXAttribute( attribute ) {
				if ( ! isClassName( attribute ) ) {
					return;
				}
				const strings = collectStrings( attribute.value );
				if ( strings.flatMap( tokensOf ).some( ( token ) => STYLE.test( token ) ) ) {
					return;
				}
				const widthNode = strings.find( ( node ) => tokensOf( node ).some( isWidth ) );
				if ( widthNode ) {
					context.report( {
						node: widthNode,
						messageId: "missingStyle",
						data: { width: tokensOf( widthNode ).find( isWidth ) },
						fix: widthNode.type === "Literal" ? appendStyle( widthNode ) : null,
					} );
				}
			},
		};
	},
};
