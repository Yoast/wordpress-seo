<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

/**
 * Validates and saves the fields an ability changes, one at a time.
 *
 * Fields that cannot be applied or saved, or are saved in a sanitized form, are collected in a single warning, while
 * the other fields are still saved.
 * How a field is saved is up to the extending class.
 *
 * @internal Backs the abilities that update settings. Not meant to be used outside of Yoast SEO, so it can change at
 *           any time without notice.
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
	 * Returns the stored value of a single field.
	 *
	 * @param string               $field_name The name of the field.
	 * @param array<string, mixed> $context    What the extending class needs to read the field, as passed to
	 *                                         update_fields().
	 *
	 * @return mixed The stored value.
	 */
	abstract protected function get_field_value( string $field_name, array $context );

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
		$warnings     = [];
		$saved_any    = false;
		$rejected_any = false;

		foreach ( \array_keys( \array_intersect_key( $fields, $input ) ) as $field_name ) {
			$update = $this->update_field( $validators, $field_name, $input[ $field_name ], $context );
			if ( $update['saved'] ) {
				$saved_any = true;
			}
			else {
				$rejected_any = true;
			}

			if ( $update['warning'] !== null ) {
				$warnings[] = $update['warning'];
			}
		}

		if ( $rejected_any ) {
			$warnings[] = ( $saved_any ) ? \__( 'The other settings were saved.', 'wordpress-seo' ) : \__( 'No other settings were saved.', 'wordpress-seo' );
		}

		$warning = ( $warnings !== [] ) ? \implode( ' ', $warnings ) : null;

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
	 * @return array{saved: bool, warning: string|null} Whether the field was saved, and a warning when it was not
	 *                                                   saved as provided.
	 */
	protected function update_field( array $validators, string $field_name, $value, array $context ): array {
		$warning = $this->validate_field( $validators, $field_name, $value );
		if ( $warning !== null ) {
			return [
				'saved'   => false,
				'warning' => $warning,
			];
		}

		$previous_value = $this->get_field_value( $field_name, $context );

		if ( $this->save_field( $field_name, $value, $context ) ) {
			return [
				'saved'   => true,
				'warning' => null,
			];
		}

		// A value that got sanitized into something else is stored all the same, which only the stored value tells apart from a rejected one.
		if ( $this->get_field_value( $field_name, $context ) !== $previous_value ) {
			return [
				'saved'   => true,
				'warning' => \sprintf(
					/* translators: %s expands to the name of a setting. */
					\__( 'The %s setting was saved after being cleaned up, so its saved value differs from the one provided.', 'wordpress-seo' ),
					$field_name,
				),
			];
		}

		return [
			'saved'   => false,
			'warning' => \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting could not be saved as provided, so its current value is returned.', 'wordpress-seo' ),
				$field_name,
			),
		];
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
