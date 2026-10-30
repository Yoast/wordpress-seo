<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

/**
 * Validates and saves the fields an ability changes, one at a time.
 *
 * Fields that cannot be applied or saved are collected in a single warning, while the other fields are still saved.
 * How a field is saved is up to the extending class.
 */
abstract class Abstract_Fields_Updater {

	use Schema_Type_Cast_Trait;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through filters can hold any value.

	/**
	 * Saves a single field.
	 *
	 * @param string               $field_name The name of the field.
	 * @param mixed                $value      The value to save.
	 * @param array<string, mixed> $context    What the extending class needs to save the field, as passed to
	 *                                         update_fields().
	 *
	 * @return bool Whether the field was saved as provided.
	 */
	abstract protected function save_field( string $field_name, $value, array $context ): bool;

	/**
	 * Validates and saves the fields present in the input (patch semantics).
	 *
	 * @param array<string, array<string, mixed>> $fields     The JSON schema of each field, keyed by field name.
	 * @param array<string, callable>             $validators The validator of each field that has one, keyed by field
	 *                                                        name. It receives the value and the field name, and
	 *                                                        returns a warning to skip saving the field.
	 * @param array<string, mixed>                $input      The fields to change, keyed by field name.
	 * @param array<string, mixed>                $context    What the extending class needs to save the fields.
	 *
	 * @return array{warning: string|null, saved_any: bool} A warning when some fields could not be changed, and
	 *                                                      whether any field was saved.
	 */
	protected function update_fields( array $fields, array $validators, array $input, array $context = [] ): array {
		$warnings  = [];
		$saved_any = false;

		foreach ( \array_keys( \array_intersect_key( $fields, $input ) ) as $field_name ) {
			$warning = $this->update_field( $validators, $field_name, $input[ $field_name ], $context );
			if ( $warning === null ) {
				$saved_any = true;
				continue;
			}

			$warnings[] = $warning;
		}

		$warning = null;
		if ( $warnings !== [] ) {
			$warnings[] = ( $saved_any ) ? \__( 'The other settings were saved.', 'wordpress-seo' ) : \__( 'No other settings were saved.', 'wordpress-seo' );
			$warning    = \implode( ' ', $warnings );
		}

		return [
			'warning'   => $warning,
			'saved_any' => $saved_any,
		];
	}

	/**
	 * Validates and saves a single field.
	 *
	 * @param array<string, callable> $validators The validator of each field that has one, keyed by field name.
	 * @param string                  $field_name The name of the field.
	 * @param mixed                   $value      The value to save.
	 * @param array<string, mixed>    $context    What the extending class needs to save the field.
	 *
	 * @return string|null A warning when the field could not be saved, null otherwise.
	 */
	protected function update_field( array $validators, string $field_name, $value, array $context ): ?string {
		$warning = $this->validate_field( $validators, $field_name, $value );
		if ( $warning !== null ) {
			return $warning;
		}

		if ( ! $this->save_field( $field_name, $value, $context ) ) {
			// A failed save is also reported when the value was invalid or got sanitized into something else,
			// so the warning points to the returned value rather than claiming nothing was stored.
			return \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting could not be saved as provided, so its current value is returned.', 'wordpress-seo' ),
				$field_name,
			);
		}

		return null;
	}

	/**
	 * Validates a single field with its validator, if any.
	 *
	 * @param array<string, callable> $validators The validator of each field that has one, keyed by field name.
	 * @param string                  $field_name The name of the field.
	 * @param mixed                   $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_field( array $validators, string $field_name, $value ): ?string {
		if ( ! isset( $validators[ $field_name ] ) ) {
			return null;
		}

		$warning = \call_user_func( $validators[ $field_name ], $value, $field_name );

		// Anything but a non-empty string cannot be relayed as a warning, so the value is saved instead.
		if ( ! \is_string( $warning ) || $warning === '' ) {
			return null;
		}

		return $warning;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
