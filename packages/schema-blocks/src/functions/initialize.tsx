import "../instructions";
import { registerBlockType } from "@wordpress/blocks";
import { Fill } from "@wordpress/components";
import { createElement, Fragment } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import { initializeSchemaBlocksStore } from "./redux";
import { WarningBlock } from "../blocks/warning-block/configuration";
import { processBlock, processSchema } from "./process";
import filter from "./gutenberg/filter";
import watch from "./gutenberg/watch";
import logger, { LogLevel } from "./logger";
import injectSidebar from "./gutenberg/inject-sidebar";
import { SchemaAnalysis } from "./presenters/SchemaAnalysis";

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
	 * Creates the SchemaAnalysis component.
	 *
	 * @param props The props.
	 *
	 * @returns The SchemaAnalysis component.
	 */
	const SchemaAnalysisFill = (): React.ReactElement => {
		return (
			<Fragment>
				{ [ "sidebar", "metabox" ].map( location => (
					<Fill
						key={ location }
						name={ [ "yoast-schema-blocks-analysis", location ].join( "-" ) }
					>
						<SchemaAnalysis />
					</Fill>
				) ) }
			</Fragment>
		);
	};

	// Register the SchemaAnalysis as a plugin, because it needs to be in the same React tree as Gutenberg.
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
