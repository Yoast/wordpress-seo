import { registerBlockType } from "@wordpress/blocks";

import "../instructions";
import logger, { LogLevel } from "./logger";
import { WarningBlock } from "../blocks/warning-block/configuration";
import { processBlock, processSchema } from "./process";
import filter from "./gutenberg/filter";
import watch from "./gutenberg/watch";

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
 *
 * @param logLevel The required minimum severity for a log message to appear in logs.
 */
export function initialize( logLevel: LogLevel = LogLevel.ERROR ) {
	logger.setLogLevel( logLevel );

	registerBlockType( "yoast/warning-block", WarningBlock );

	jQuery( 'script[type="text/schema-template"]' ).each( function() {
		try {
			const template = removeWhitespace( this.innerHTML );
			const definition = processSchema( template );
			definition.register();
		} catch ( e ) {
			logger.error( "Failed to parse schema-template", e, this );
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
			logger.error( "Failed to parse gutenberg-template", e, this );
		}
	} );

	// Watch Gutenberg for block changes that require schema updates.
	watch();
}
