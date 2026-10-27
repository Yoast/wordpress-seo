<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

/**
 * Describes the settings that an ability can write, keyed by field name.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter of the extending class is exposed, validated and written without further changes.
 */
abstract class Abstract_Field_Map {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * The fields, cached so the schemas and the updater always agree on them.
	 *
	 * @var array<string, array<string, mixed>>|null
	 */
	private $fields;

	/**
	 * The validators registered along with the fields, keyed by field name.
	 *
	 * @var array<string, callable>
	 */
	private $validators = [];

	/**
	 * Returns the fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by field name.
	 */
	abstract protected function get_default_fields(): array;

	/**
	 * Passes the default fields through the filter that lets add-ons add fields.
	 *
	 * @param array<string, array<string, mixed>> $default_fields The JSON schema of each field, keyed by field name.
	 *
	 * @return mixed The filtered fields, which are not guaranteed to be an array.
	 */
	abstract protected function get_filtered_fields( array $default_fields );

	/**
	 * Resolves the keys next to the schema that only the extending class knows about.
	 *
	 * @param string               $field_name The name of the field.
	 * @param array<string, mixed> $schema     The JSON schema of the field, along with those keys.
	 *
	 * @return array<string, mixed>|null The JSON schema without those keys, or null to drop the field.
	 */
	protected function resolve_extra_keys( string $field_name, array $schema ): ?array {
		return $schema;
	}

	/**
	 * Returns the writable fields, mapped to their JSON schema.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by field name.
	 */
	public function get_fields(): array {
		$this->resolve_fields();

		return $this->fields;
	}

	/**
	 * Returns the validators registered along with the fields.
	 *
	 * @return array<string, callable> The validator of each field that has one, keyed by field name.
	 */
	public function get_validators(): array {
		$this->resolve_fields();

		return $this->validators;
	}

	/**
	 * Resolves the fields and their validators, once, so the schemas and the updater always agree on them.
	 *
	 * @return void
	 */
	private function resolve_fields(): void {
		if ( $this->fields !== null ) {
			return;
		}

		$default_fields = $this->get_default_fields();
		$fields         = $this->get_filtered_fields( $default_fields );

		if ( ! \is_array( $fields ) ) {
			$fields = $default_fields;
		}

		$this->fields = [];

		foreach ( $fields as $field_name => $schema ) {
			// A field without a schema can neither be described to agents nor validated, so it is dropped.
			if ( ! \is_array( $schema ) ) {
				continue;
			}

			$validator = null;
			if ( \array_key_exists( 'validate_callback', $schema ) ) {
				if ( ! \is_callable( $schema['validate_callback'] ) ) {
					continue;
				}

				$validator = $schema['validate_callback'];

				// The callback is not part of the JSON schema that is published to agents.
				unset( $schema['validate_callback'] );
			}

			$schema = $this->resolve_extra_keys( $field_name, $schema );
			if ( $schema === null ) {
				continue;
			}

			if ( $validator !== null ) {
				$this->validators[ $field_name ] = $validator;
			}

			$this->fields[ $field_name ] = $schema;
		}
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
