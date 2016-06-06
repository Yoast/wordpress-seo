var blockElements = [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption",
	"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav",
	"noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ];
var inlineElements = [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea" ];

var blockElementsRegex = new RegExp( "^(" + blockElements.join( "|" ) + ")$", "im" );
var inlineElementsRegex = new RegExp( "^(" + inlineElements.join( "|" ) + ")$", "im" );

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>$", "im" );
var blockElementEndRegex = new RegExp( "^</(" + blockElements.join( "|" ) + ")[^>]*?>$", "im" );

var inlineElementStartRegex = new RegExp( "^<(" + inlineElements.join( "|" ) + ")[^>]*>$", "im" );
var inlineElementEndRegex = new RegExp( "^</(" + inlineElements.join( "|" ) + ")[^>]*>$", "im" );

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/m;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/m;

var contentRegex = /^[^<]+$/m;
var greaterThanContentRegex = /^<[^><]*$/;

var commentStartRegex = /^<!--$/;
var commentEndRegex = /^-->$/;

var core = require( "tokenizer2/core" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	htmlBlockTokenizer.addRule( contentRegex, "content" );
	htmlBlockTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );

	htmlBlockTokenizer.addRule( blockElementStartRegex, "block-start" );
	htmlBlockTokenizer.addRule( blockElementEndRegex, "block-end" );
	htmlBlockTokenizer.addRule( inlineElementStartRegex, "inline-start" );
	htmlBlockTokenizer.addRule( inlineElementEndRegex, "inline-end" );

	htmlBlockTokenizer.addRule( commentStartRegex, "comment-start" );
	htmlBlockTokenizer.addRule( commentEndRegex, "comment-end" );

	htmlBlockTokenizer.addRule( otherElementStartRegex, "other-element-start" );
	htmlBlockTokenizer.addRule( otherElementEndRegex, "other-element-end" );
}

/**
 * Returns whether or not the given element name is a block element
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement( htmlElementName ) {
	return blockElementsRegex.test( htmlElementName );
}

/**
 * Returns whether or not the given element name is an inline element
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement( htmlElementName ) {
	return inlineElementsRegex.test( htmlElementName );
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks( text ) {
	var blocks = [], depth = 0, currentBlock = "";

	createTokenizer();
	htmlBlockTokenizer.onText( text );

	try {
		htmlBlockTokenizer.end();
	} catch ( e ) {
		return [];
	}

	forEach( tokens, function( token, i ) {
		var nextToken = tokens[ i + 1 ];

		switch ( token.type ) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
			case "comment-start":
			case "comment-end":
				if ( !nextToken || ( depth === 0 && ( nextToken.type === "block-start" || nextToken.type === "block-end" ) ) ) {
					currentBlock += token.src;
					blocks.push( currentBlock );
					currentBlock = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				depth++;
				currentBlock += token.src;
				break;

			case "block-end":
				depth--;
				currentBlock += token.src;

				if ( depth === 0 ) {
					blocks.push( currentBlock );
					currentBlock = "";
				}
				break;
		}

		if ( depth < 0 ) {
			depth = 0;
		}
	} );

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize( getBlocks )
};
