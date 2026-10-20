<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

/**
 * Casts stored values to the type their JSON schema declares, so they pass the output schema of an ability.
 */
trait Schema_Type_Cast_Trait {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through filters can hold any value.

	/**
	 * Casts a stored value to the type its schema declares.
	 *
	 * Unset settings come back as a default that is not always of the declared type, like an empty string for
	 * user meta or false for some options, which would fail the output schema.
	 *
	 * @param mixed                $value  The stored value.
	 * @param array<string, mixed> $schema The JSON schema of the field.
	 *
	 * @return mixed The value, cast to the declared type.
	 */
	protected function cast_to_schema_type( $value, array $schema ) {
		switch ( ( $schema['type'] ?? null ) ) {
			case 'integer':
				return (int) $value;
			case 'string':
				return (string) $value;
			case 'boolean':
				return (bool) $value;
			case 'array':
				return ( \is_array( $value ) ) ? $value : [];
			default:
				return $value;
		}
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
