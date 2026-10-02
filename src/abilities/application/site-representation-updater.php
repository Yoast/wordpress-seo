<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
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
	 * The method that validates each field before it is saved, keyed by option name.
	 *
	 * Each method returns a warning when the value cannot be saved, in which case the field is skipped.
	 *
	 * @var array<string, string>
	 */
	private const VALIDATORS = [
		'company_or_person'         => 'validate_company_or_person',
		'company_or_person_user_id' => 'validate_user_id',
		'company_logo'              => 'validate_logo',
		'person_logo'               => 'validate_logo',
	];

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
	 * The Local SEO active conditional.
	 *
	 * @var Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image_helper;

	/**
	 * The social profiles helper.
	 *
	 * @var Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper                $options_helper               The options helper.
	 * @param Site_Representation_Field_Map $field_map                    The site representation field map.
	 * @param Local_SEO_Active_Conditional  $local_seo_active_conditional The Local SEO active conditional.
	 * @param Image_Helper                  $image_helper                 The image helper.
	 * @param Social_Profiles_Helper        $social_profiles_helper       The social profiles helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Site_Representation_Field_Map $field_map,
		Local_SEO_Active_Conditional $local_seo_active_conditional,
		Image_Helper $image_helper,
		Social_Profiles_Helper $social_profiles_helper
	) {
		$this->options_helper               = $options_helper;
		$this->field_map                    = $field_map;
		$this->local_seo_active_conditional = $local_seo_active_conditional;
		$this->image_helper                 = $image_helper;
		$this->social_profiles_helper       = $social_profiles_helper;
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

		// The ID is only saved along with its URL, so the two never point to different images.
		if ( \in_array( $field_name, self::LOGOS, true ) ) {
			$this->options_helper->set( $field_name . '_id', $this->get_logo_id( $value ) );
			// @TODO: Check if the watcher takes care of the below. If so, remove it.
			$this->options_helper->set( $field_name . '_meta', false );
		}

		return null;
	}

	/**
	 * Validates a single field, first against the rules of Yoast SEO and then against the validator its add-on
	 * registered along with it.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_field( string $field_name, $value ): ?string {
		if ( isset( self::VALIDATORS[ $field_name ] ) ) {
			$warning = $this->{ self::VALIDATORS[ $field_name ] }( $field_name, $value );
			if ( $warning !== null ) {
				return $warning;
			}
		}

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
	 * are in the first-time configuration, including the ones that add-ons register there.
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

		return $this->options_helper->set( $field_name, $value ) === true;
	}

	/**
	 * Validates the represented entity type.
	 *
	 * Local SEO forces the site to represent an organization when reading the option, so writing "person"
	 * would be undone right away and reported as a failed save.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_company_or_person( string $field_name, $value ): ?string {
		if ( $value !== 'person' || ! $this->local_seo_active_conditional->is_met() ) {
			return null;
		}

		return \sprintf(
			/* translators: %s expands to Yoast Local SEO. */
			\__( 'The site was not set to represent a person, because %s is active and requires the site to represent an organization.', 'wordpress-seo' ),
			'Yoast Local SEO',
		);
	}

	/**
	 * Validates that the user to represent exists. 0 clears the setting, so it is not looked up.
	 *
	 * @param string $field_name The option name of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_user_id( string $field_name, $value ): ?string {
		if ( empty( $value ) || \get_userdata( $value ) !== false ) {
			return null;
		}

		return \__( 'The user to represent was not changed, because no user exists with the given ID.', 'wordpress-seo' );
	}

	/**
	 * Validates that a logo URL is cleared or points to an image in the media library.
	 *
	 * @param string $field_name The option name of the logo URL.
	 * @param string $value      The logo URL to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_logo( string $field_name, string $value ): ?string {
		if ( $value === '' ) {
			return null;
		}

		$attachment_id = $this->get_logo_id( $value );
		if ( $attachment_id > 0 && $this->image_helper->is_valid_attachment( $attachment_id ) ) {
			return null;
		}

		return \sprintf(
			/* translators: %s expands to the name of a setting. */
			\__( 'The %s setting was not changed, because it is not the URL of an image in the media library.', 'wordpress-seo' ),
			$field_name,
		);
	}

	/**
	 * Returns the attachment ID of a logo URL, or 0 when the logo is cleared or not in the media library.
	 *
	 * The schema reads the logo by its ID while the first-time configuration shows it by its URL, so deriving
	 * the ID keeps both pointing to the same image.
	 *
	 * @param string $url The logo URL.
	 *
	 * @return int The attachment ID.
	 */
	private function get_logo_id( string $url ): int {
		if ( $url === '' ) {
			return 0;
		}

		return (int) $this->image_helper->get_attachment_by_url( $url );
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
