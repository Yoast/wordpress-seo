<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Logo_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;

/**
 * Application service that updates the site representation settings.
 *
 * The values are saved through the options helper, so they are sanitized and validated exactly like
 * they are when saved from the settings page.
 */
class Site_Representation_Updater {

	/**
	 * The logos whose cached attachment meta is invalidated when either their URL or their ID changes.
	 *
	 * @var array<string>
	 */
	private const LOGOS = [ 'company_logo', 'person_logo' ];

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The site representation field map.
	 *
	 * @var Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The site representation logo helper.
	 *
	 * @var Site_Representation_Logo_Helper
	 */
	private $logo_helper;

	/**
	 * The social profiles helper.
	 *
	 * @var Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper                  $options_helper         The options helper.
	 * @param Site_Representation_Field_Map   $field_map              The site representation field map.
	 * @param Site_Representation_Logo_Helper $logo_helper            The site representation logo helper.
	 * @param Social_Profiles_Helper          $social_profiles_helper The social profiles helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Site_Representation_Field_Map $field_map,
		Site_Representation_Logo_Helper $logo_helper,
		Social_Profiles_Helper $social_profiles_helper
	) {
		$this->options_helper         = $options_helper;
		$this->field_map              = $field_map;
		$this->logo_helper            = $logo_helper;
		$this->social_profiles_helper = $social_profiles_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Updates the site representation settings in the input and returns the new state of all of them.
	 *
	 * Only fields present in the input are changed (patch semantics). Settings that cannot be applied
	 * or saved are reported in a warning, while the other settings are still saved.
	 *
	 * @param array<string, mixed> $input The site representation settings to change, keyed by option name.
	 *
	 * @return array<string, mixed> The new site representation settings, plus a warning when some could not be changed.
	 */
	public function update( array $input ): array {
		$fields    = $this->field_map->get_fields();
		$warnings  = [];
		$saved_any = false;

		foreach ( \array_keys( \array_intersect_key( $fields, $input ) ) as $field_name ) {
			$warning = $this->update_field( $field_name, $input[ $field_name ] );
			if ( $warning === null ) {
				$saved_any = true;
				continue;
			}

			$warnings[] = $warning;
		}

		$result = $this->get_settings( $fields );

		if ( $warnings !== [] ) {
			$warnings[]        = ( $saved_any ) ? \__( 'The other settings were saved.', 'wordpress-seo' ) : \__( 'No other settings were saved.', 'wordpress-seo' );
			$result['warning'] = \implode( ' ', $warnings );
		}

		return $result;
	}

	/**
	 * Validates and saves a single field.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the field could not be saved, null otherwise.
	 */
	private function update_field( string $field_name, $value ): ?string {
		$warning = $this->validate_field( $field_name, $value );
		if ( $warning !== null ) {
			return $warning;
		}

		if ( ! $this->save_field( $field_name, $value ) ) {
			// A failed save is also reported when the value was invalid or the option sanitized it into
			// something else, so the warning points to the returned value rather than claiming nothing was stored.
			return \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting could not be saved as provided, so its current value is returned.', 'wordpress-seo' ),
				$field_name,
			);
		}

		return null;
	}

	/**
	 * Validates a single field with the validator it is registered with in the field map, if any.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_field( string $field_name, $value ): ?string {
		$validators = $this->field_map->get_validators();
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

	/**
	 * Saves a single field.
	 *
	 * Organization social profiles are saved through the social profiles helper, so they are validated like they
	 * are in the first-time configuration, including the ones that add-ons register there. Logos are saved along
	 * with their ID.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return bool Whether the field was saved.
	 */
	private function save_field( string $field_name, $value ): bool {
		if ( \array_key_exists( $field_name, $this->social_profiles_helper->get_organization_social_profile_fields() ) ) {
			// One profile at a time, as the helper saves none of the provided profiles when one of them is invalid.
			return $this->social_profiles_helper->set_organization_social_profiles( [ $field_name => $value ] ) === [];
		}

		if ( \in_array( $field_name, self::LOGOS, true ) ) {
			return $this->save_logo( $field_name, $value );
		}

		return $this->options_helper->set( $field_name, $value ) === true;
	}

	/**
	 * Saves a logo URL along with its ID, so the two never point to different images.
	 *
	 * @param string $field_name The option name of the logo URL.
	 * @param string $url        The logo URL.
	 *
	 * @return bool Whether the logo URL was saved.
	 */
	private function save_logo( string $field_name, string $url ): bool {
		$previous_url = $this->options_helper->get( $field_name );
		$saved        = $this->options_helper->set( $field_name, $url ) === true;

		// A sanitized URL (trimmed or percent-encoded, for example) is stored even though the save is reported as failed,
		// so the ID follows any change of the stored URL. It is derived from the validated URL, as it points to the same image.
		if ( $saved || $this->options_helper->get( $field_name ) !== $previous_url ) {
			$this->options_helper->set( $field_name . '_id', $this->logo_helper->get_logo_id( $url ) );
			// Much like saving the logo from the settings/FTC, let's also clear its meta information so that it can lazily be generated when needed.
			$this->options_helper->set( $field_name . '_meta', false );
		}

		return $saved;
	}

	/**
	 * Returns the current value of each field, cast to the type its schema declares.
	 *
	 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by option name.
	 *
	 * @return array<string, mixed> The current value of each field.
	 */
	private function get_settings( array $fields ): array {
		$settings = [];

		foreach ( $fields as $field_name => $schema ) {
			$value = $this->options_helper->get( $field_name );

			// Unset options come back as their default, which is not always of the declared type
			// (the user ID defaults to false, for example).
			switch ( ( $schema['type'] ?? null ) ) {
				case 'integer':
					$value = (int) $value;
					break;
				case 'string':
					$value = (string) $value;
					break;
			}

			$settings[ $field_name ] = $value;
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
