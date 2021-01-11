import "./instructions";
import { processSchema, processBlock } from "./functions/process";
import watch from "./functions/gutenberg/watch";
import filter from "./functions/gutenberg/filter";
import { registerBlockType } from "@wordpress/blocks";
import { WarningBlock } from "./blocks/warning-block/configuration";

/**
 * Removes all whitespace including line breaks from a string.
 *
 * @param text The text to remove the whitespace from.
 *
 * @returns {string} The converted string.
 */
function removeWhitespace( text: string ): string {
	return text.split( "\n" ).map( ( s: string ) => s.trim() ).join( "" );
}

/**
 * Initializes the Schema templates and block templates.
 */
export default function initialize() {
	registerBlockType( "yoast/warning-block", WarningBlock );

	jQuery( 'script[type="text/schema-template"]' ).each( function() {
		try {
			const template = removeWhitespace( this.innerHTML );
			const definition = processSchema( template );
			definition.register();
		} catch ( e ) {
			console.error( "Failed to parse schema-template", e, this );
		}
	} );

	// Filter in our schema definitions with Gutenberg.
	filter();

	jQuery( 'script[type="text/block-template"]' ).each( function() {
		try {
			const template = removeWhitespace( this.innerHTML );
			const definition = processBlock( template );
			definition.register();
		} catch ( e ) {
			console.error( "Failed to parse gutenberg-template", e, this );
		}
	} );

	// Watch Gutenberg for block changes that require schema updates.
	watch();
}
