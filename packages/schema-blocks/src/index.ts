import "./instructions";
import { processSchema, processBlock } from "./functions/process";
import watch from "./functions/gutenberg/watch";
import filter from "./functions/gutenberg/filter";
import { registerBlockType } from "@wordpress/blocks";
import { WarningBlock } from "./blocks/warning-block/configuration";

/**
 * Removes all line breaks from a string.
 *
 * @returns {string} The converted string.
 */
function getTemplate(): string {
	return this.innerHTML.split( "\n" ).map( s => s.trim() ).join( "" );
}

/**
 * Initializes the Schema templates and block templates.
 */
export default function initialize() {
	registerBlockType( "yoast/warning-block", WarningBlock );

	jQuery( 'script[type="text/schema-template"]' ).each( function() {
		try {
			const template = getTemplate();
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
			const template = getTemplate();
			const definition = processBlock( template );
			definition.register();
		} catch ( e ) {
			console.error( "Failed to parse gutenberg-template", e, this );
		}
	} );

	// Watch Gutenberg for block changes that require schema updates.
	watch();
}
