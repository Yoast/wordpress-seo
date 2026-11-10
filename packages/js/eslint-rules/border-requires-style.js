/**
 * Requires a border style next to any `yst-border*` width utility in a `className`.
 *
 * The preflight's `border-style: solid` has no specificity, so any host rule such as `.components-button { border: 0 }`
 * resets the style to `none`, and a width utility alone then draws no border. See docs/ui-library-without-root.md.
 */

// A border width utility, optionally behind variants: `yst-border`, `yst-border-2`, `yst-border-t`, `md:yst-border-x-4`.
// Arbitrary values only count when they are a length, so a color like `yst-border-[#e5e7eb]` is left alone.
const WIDTH = /^((?:[\w-]+:)*)yst-border(?:-[trblxyse])?(?:-(\d+|\[(?:(?:length|line-width):[^\]]+|[\d.]+[a-z%]*)\]))?$/;
const STYLE = /^((?:[\w-]+:)*)yst-border-(?:solid|dashed|dotted|double|none|hidden)$/;

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

// How each node type renders class names. Conditions, comparisons and lookups are skipped: their strings are never rendered.
const CLASS_PARTS = {
	ConditionalExpression: ( node ) => [ { node: node.consequent, conditional: true }, { node: node.alternate, conditional: true } ],
	LogicalExpression: ( node ) => ( node.operator === "&&" ? [] : [ { node: node.left, conditional: true } ] )
		.concat( { node: node.right, conditional: true } ),
	BinaryExpression: ( node ) => ( node.operator === "+" ? [ { node: node.left }, { node: node.right } ] : [] ),
	MemberExpression: () => [],
	CallExpression: ( node ) => node.arguments.map( ( argument ) => ( { node: argument } ) ),
	// In `classNames( { "yst-border": isActive } )` the key is the class and the value its condition.
	Property: ( node ) => ( node.computed ? [] : [ { node: node.key, conditional: true } ] ),
};

/**
 * Returns the parts of a node that render class names, and whether each one only renders under a condition.
 *
 * @param {Object} node The AST node.
 *
 * @returns {{node: Object, conditional: boolean}[]} The class-producing child nodes.
 */
const classPartsOf = ( node ) => ( CLASS_PARTS[ node.type ] || ( () => childrenOf( node ).map( ( child ) => ( { node: child } ) ) ) )( node );

/**
 * Collects the string literals and template parts inside a `className` value.
 *
 * @param {Object}  node                The AST node.
 * @param {boolean} [conditional=false] Whether the node only renders under a condition.
 *
 * @returns {{node: Object, conditional: boolean}[]} The literal nodes.
 */
const collectStrings = ( node, conditional = false ) => {
	if ( isString( node ) ) {
		return [ { node, conditional } ];
	}
	return classPartsOf( node ).flatMap( ( part ) => collectStrings( part.node, conditional || Boolean( part.conditional ) ) );
};

/**
 * Returns the class tokens of a literal or template part.
 *
 * @param {Object} node The literal or template element node.
 *
 * @returns {string[]} The tokens.
 */
const tokensOf = ( node ) => ( node.type === "Literal" ? node.value : node.value.cooked || "" ).split( /\s+/ ).filter( Boolean );

/**
 * Returns the variant prefix of a non-zero border width utility.
 *
 * @param {string} token The class token.
 *
 * @returns {string|null} The prefix, e.g. `md:` or an empty string, or null when the token is no width.
 */
const widthVariant = ( token ) => {
	const match = WIDTH.exec( token );
	return match && match[ 2 ] !== "0" ? match[ 1 ] : null;
};

/**
 * Returns the variant prefixes of the border style utilities among tokens.
 *
 * @param {string[]} tokens The class tokens.
 *
 * @returns {string[]} The prefixes, e.g. `hover:` or an empty string.
 */
const styleVariants = ( tokens ) => tokens.map( ( token ) => STYLE.exec( token ) ).filter( Boolean ).map( ( match ) => match[ 1 ] );

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
			missingStyle: "`{{ width }}` draws no border once host CSS resets the border style; add `yst-border-solid`.",
		},
	},
	create( context ) {
		/**
		 * Appends `yst-border-solid` to a string literal, keeping its source text and trailing whitespace as written.
		 *
		 * @param {Object} node The literal node.
		 *
		 * @returns {function} The fixer.
		 */
		const appendStyle = ( node ) => ( fixer ) => {
			const source = context.sourceCode.getText( node );
			const quote = source[ 0 ];
			// The trailing whitespace stays last, so `"yst-border " + extra` keeps the space before `extra`.
			return fixer.replaceText( node, quote + source.slice( 1, -1 ).replace( /\s*$/, " yst-border-solid$&" ) + quote );
		};

		return {
			JSXAttribute( attribute ) {
				if ( ! isClassName( attribute ) ) {
					return;
				}
				const strings = collectStrings( attribute.value );
				// A style in a string that always renders covers the widths in every other string.
				const alwaysStyled = strings
					.filter( ( string ) => ! string.conditional )
					.flatMap( ( string ) => styleVariants( tokensOf( string.node ) ) );

				strings.forEach( ( { node } ) => {
					const tokens = tokensOf( node );
					const styled = alwaysStyled.concat( styleVariants( tokens ) );
					const width = tokens.find( ( token ) => {
						const variant = widthVariant( token );
						return variant !== null && ! styled.includes( "" ) && ! styled.includes( variant );
					} );
					if ( width ) {
						context.report( {
							node,
							messageId: "missingStyle",
							data: { width },
							fix: node.type === "Literal" ? appendStyle( node ) : null,
						} );
					}
				} );
			},
		};
	},
};
