<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use stdClass;

/**
 * Builds the input schema of an ability that can be called without input.
 */
trait Optional_Input_Schema_Trait {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns an object input schema with the given properties, all of them optional.
	 *
	 * @param array<string, array<string, mixed>> $properties The input properties, keyed by name.
	 *
	 * @return array<string, mixed> The input schema.
	 */
	protected function get_optional_input_schema( array $properties = [] ): array {
		$schema = [
			'type'                 => 'object',
			'additionalProperties' => false,
			'default'              => new stdClass(),
		];

		if ( $properties !== [] ) {
			$schema['properties'] = $properties;
		}

		return $schema;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
