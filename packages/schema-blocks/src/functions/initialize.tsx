import "../instructions";
import { registerBlockType } from "@wordpress/blocks";
import { initializeSchemaBlocksStore } from "./redux";
import { WarningBlock } from "../blocks/warning-block/configuration";
import { processBlock, processSchema } from "./process";
import filter from "./gutenberg/filter";
import watch from "./gutenberg/watch";
import logger, { LogLevel } from "./logger";
import injectSidebar from "./gutenberg/inject-sidebar";
import { registerPlugin } from "@wordpress/plugins";
import { Fill } from "@wordpress/components";
import { SchemaAnalysis } from "./presenters/SchemaAnalysis";
import { createElement } from "@wordpress/element";

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
export function initialize( logLevel: LogLevel = LogLevel.ERROR ): void {
	logger.setLogLevel( logLevel );

	initializeSchemaBlocksStore();

	injectSidebar( [
		"core/paragraph",
		"core/image",
		"core/heading",
		"core/separator",
		"yoast/warning-block",
	], [
		"yoast/job-posting",
	] );

	registerInternalBlocks();

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

	/**
	 * Creates the Analysis component.
	 *
	 * @param props The props.
	 *
	 * @returns The analysis component.
	 */
	const SchemaAnalysisFill = (): React.ReactElement => {
		return (
			<Fill name="YoastSchemaBlocksAnalysis">
				<SchemaAnalysis />
			</Fill>
		);
	};

	// Register the schema analysis as a plugin, because it needs to be in the same react tree as gutenberg.
	registerPlugin( "yoast-seo-schema-blocks-analysis", {
		render: SchemaAnalysisFill,
		icon: null,
	} );

	// Watch Gutenberg for block changes that require schema updates.
	watch();
}

/**
 * Registers additional blocks needed for schema blocks use cases.
 */
function registerInternalBlocks() {
	registerBlockType( "yoast/warning-block", WarningBlock );
}
