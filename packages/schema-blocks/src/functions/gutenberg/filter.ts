import { addFilter } from "@wordpress/hooks";
import { MutableBlockConfiguration } from "../../core/blocks/BlockDefinition";
import { schemaDefinitions } from "../../core/schema/SchemaDefinition";

/**
 * Filters in schema attributes for blocks.
 */
export default function filter() {
	addFilter(
		"blocks.registerBlockType",
		"wordpress-seo/schema-blocks/schema-attribute",
		( settings: MutableBlockConfiguration, name: string ): MutableBlockConfiguration => {
			if ( ! Object.keys( schemaDefinitions ).includes( name ) ) {
				return settings;
			}
			// eslint-disable-next-line no-console
			console.log( "Adding schema to: ", name );
			if ( ! settings.attributes ) {
				settings.attributes = {};
			}
			( settings.attributes as Record<string, unknown> )[ "yoast-schema" ] = { type: "object" };
			return settings;
		},
	);
}
