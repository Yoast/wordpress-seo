<?php

use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;

class Schema_Enhancement_Factory {

/**
	 * Returns the appropriate schema enhancer based on the schema type.
	 *
	 * @param string $schema_type The type of schema (e.g., 'Article', 'Person').
	 *
	 * @return Schema_Enhancement_Interface|null The corresponding schema enhancer or null if none exists.
	 */
	public function get_enhancer( string $schema_type ): ?Schema_Enhancement_Interface {
		switch ( $schema_type ) {
			case 'Article':
				return new Article_Schema_Enhancer();
			case 'Person':
				return new Person_Schema_Enhancer();
			default:
				return null; // No enhancer available for the given schema type.
		}

	}

}
