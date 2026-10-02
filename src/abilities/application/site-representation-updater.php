<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

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
	 * Constructor.
	 *
	 * @param Options_Helper                $options_helper               The options helper.
	 * @param Site_Representation_Field_Map $field_map                    The site representation field map.
	 * @param Local_SEO_Active_Conditional  $local_seo_active_conditional The Local SEO active conditional.
	 * @param Image_Helper                  $image_helper                 The image helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Site_Representation_Field_Map $field_map,
		Local_SEO_Active_Conditional $local_seo_active_conditional,
		Image_Helper $image_helper
	) {
		$this->options_helper               = $options_helper;
		$this->field_map                    = $field_map;
		$this->local_seo_active_conditional = $local_seo_active_conditional;
		$this->image_helper                 = $image_helper;
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
		$fields       = $this->field_map->get_fields();
		$warnings     = [];
		$saved_fields = [];

		foreach ( \array_keys( $fields ) as $field_name ) {
			if ( ! \array_key_exists( $field_name, $input ) ) {
				continue;
			}

			if ( isset( self::VALIDATORS[ $field_name ] ) ) {
				$warning = $this->{ self::VALIDATORS[ $field_name ] }( $field_name, $input );
				if ( $warning !== null ) {
					$warnings[] = $warning;
					continue;
				}
			}

			if ( $this->options_helper->set( $field_name, $input[ $field_name ] ) === true ) {
				$saved_fields[] = $field_name;
				continue;
			}

			// A failed save is also reported when the value was invalid or the option sanitized it into
			// something else, so the warning points to the returned value rather than claiming nothing was stored.
			$warnings[] = \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting could not be saved as provided, so its current value is returned.', 'wordpress-seo' ),
				$field_name,
			);
		}

		// The ID is only saved along with its URL, so the two never point to different images.
		foreach ( self::LOGOS as $logo ) {
			if ( \in_array( $logo, $saved_fields, true ) ) {
				$this->options_helper->set( $logo . '_id', $input[ $logo . '_id' ] );
				// @TODO: Check if the watcher takes care of the below. If so, remove it.
				$this->options_helper->set( $logo . '_meta', false );
			}
		}

		$result = $this->get_settings( $fields );

		if ( $warnings !== [] ) {
			$warnings[]        = ( $saved_fields !== [] ) ? \__( 'The other settings were saved.', 'wordpress-seo' ) : \__( 'No other settings were saved.', 'wordpress-seo' );
			$result['warning'] = \implode( ' ', $warnings );
		}

		return $result;
	}

	/**
	 * Validates the represented entity type.
	 *
	 * Local SEO forces the site to represent an organization when reading the option, so writing "person"
	 * would be undone right away and reported as a failed save.
	 *
	 * @param string               $field_name The option name of the field.
	 * @param array<string, mixed> $input      The site representation settings to change.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_company_or_person( string $field_name, array &$input ): ?string {
		if ( $input[ $field_name ] !== 'person' || ! $this->local_seo_active_conditional->is_met() ) {
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
	 * @param string               $field_name The option name of the field.
	 * @param array<string, mixed> $input      The site representation settings to change.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_user_id( string $field_name, array &$input ): ?string {
		if ( empty( $input[ $field_name ] ) || \get_userdata( $input[ $field_name ] ) !== false ) {
			return null;
		}

		return \__( 'The user to represent was not changed, because no user exists with the given ID.', 'wordpress-seo' );
	}

	/**
	 * Validates that a logo URL points to an image in the media library, and adds its attachment ID to the input.
	 *
	 * The schema reads the logo by its ID while the first-time configuration shows it by its URL, so deriving
	 * the ID keeps both pointing to the same image.
	 *
	 * @param string               $field_name The option name of the logo URL.
	 * @param array<string, mixed> $input      The site representation settings to change, resolved in place.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_logo( string $field_name, array &$input ): ?string {
		$id_field = $field_name . '_id';

		if ( $input[ $field_name ] === '' ) {
			$input[ $id_field ] = 0;
			return null;
		}

		$attachment_id = (int) $this->image_helper->get_attachment_by_url( $input[ $field_name ] );
		if ( $attachment_id > 0 && $this->image_helper->is_valid_attachment( $attachment_id ) ) {
			$input[ $id_field ] = $attachment_id;
			return null;
		}

		return \sprintf(
			/* translators: %s expands to the name of a setting. */
			\__( 'The %s setting was not changed, because it is not the URL of an image in the media library.', 'wordpress-seo' ),
			$field_name,
		);
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
