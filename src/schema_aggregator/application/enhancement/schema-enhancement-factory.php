<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;

/**
 * The Schema_Enhancement_Factory.
 */
class Schema_Enhancement_Factory {

	/**
	 * Returns the appropriate schema enhancer based on the schema type.
	 *
	 * @param array<string> $schema_types The types of schema (e.g., 'Article', 'Person').
	 *
	 * @return Schema_Enhancement_Interface|null The corresponding schema enhancer or null if none exists.
	 */
	public function get_enhancer( array $schema_types ): ?Schema_Enhancement_Interface {
		foreach ( $schema_types as $schema_type_value ) {
			switch ( $schema_type_value ) {
				case 'Article':
					return new Article_Schema_Enhancer();
				case 'Person':
					return new Person_Schema_Enhancer();
				default:
					return null; // No enhancer available for the given schema type.
			}
		}
	}
}
