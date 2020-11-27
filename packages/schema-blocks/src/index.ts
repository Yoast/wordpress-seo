import "./instructions";
import process from "./functions/process";
import SchemaDefinition from "./core/schema/SchemaDefinition";
import SchemaInstruction from "./core/schema/SchemaInstruction";
import BlockDefinition from "./core/blocks/BlockDefinition";
import BlockInstruction from "./core/blocks/BlockInstruction";
import watch from "./functions/gutenberg/watch";
import filter from "./functions/gutenberg/filter";
import { registerBlockType } from "@wordpress/blocks";
import { WarningBlock } from "./blocks/WarningBlock";

/**
 * Initializes the Schema templates and block templates.
 */
export default function initialize() {
	registerBlockType( "yoast/warning-block", WarningBlock );

	jQuery( 'script[type="text/schema-template"]' ).each( function() {
		try {
			const template = this.innerHTML.split( "\n" ).map( s => s.trim() ).join( "" );
			const definition = process( template, SchemaDefinition, SchemaInstruction );
			definition.register();
		} catch ( e ) {
			console.error( "Failed parsing schema-template", e, this );
		}
	} );

	// Filter in our schema definitions with Gutenberg.
	filter();

	jQuery( 'script[type="text/block-template"]' ).each( function() {
		try {
			const template = this.innerHTML.split( "\n" ).map( s => s.trim() ).join( "" );
			const definition = process( template, BlockDefinition, BlockInstruction );
			definition.register();
		} catch ( e ) {
			console.error( "Failed parsing guten-template", e, this );
		}
	} );

	// Watch Gutenberg for block changes that require schema updates.
	watch();
}
