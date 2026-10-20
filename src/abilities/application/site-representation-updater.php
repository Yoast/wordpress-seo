<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;

/**
 * Application service that updates the site representation settings.
 *
 * The values are saved through the options helper, so they are sanitized and validated exactly like
 * they are when saved from the settings page.
 */
class Site_Representation_Updater extends Abstract_Fields_Updater {

	/**
	 * The logo ID settings, mapped to the logo URL setting that is saved along with them.
	 *
	 * @var array<string, string>
	 */
	private const LOGOS = [
		'company_logo_id' => 'company_logo',
		'person_logo_id'  => 'person_logo',
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
	 * @param Options_Helper                $options_helper         The options helper.
	 * @param Site_Representation_Field_Map $field_map              The site representation field map.
	 * @param Image_Helper                  $image_helper           The image helper.
	 * @param Social_Profiles_Helper        $social_profiles_helper The social profiles helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Site_Representation_Field_Map $field_map,
		Image_Helper $image_helper,
		Social_Profiles_Helper $social_profiles_helper
	) {
		$this->options_helper         = $options_helper;
		$this->field_map              = $field_map;
		$this->image_helper           = $image_helper;
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
		$fields  = $this->field_map->get_fields();
		$warning = $this->update_fields( $fields, $this->field_map->get_validators(), $input )['warning'];

		$result = $this->get_settings( $fields );

		if ( $warning !== null ) {
			$result['warning'] = $warning;
		}

		return $result;
	}

	/**
	 * Saves a single field.
	 *
	 * Organization social profiles are saved through the social profiles helper, so they are validated like they
	 * are in the first-time configuration, including the ones that add-ons register there. Logo IDs are saved along
	 * with their URL.
	 *
	 * @param string               $field_name The option name of the field.
	 * @param mixed                $value      The value to save.
	 * @param array<string, mixed> $context    Unused, as the settings are site-wide.
	 *
	 * @return bool Whether the field was saved.
	 */
	protected function save_field( string $field_name, $value, array $context ): bool { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- Required by the parent class; the settings are site-wide.
		if ( \array_key_exists( $field_name, $this->social_profiles_helper->get_organization_social_profile_fields() ) ) {
			// One profile at a time, as the helper saves none of the provided profiles when one of them is invalid.
			return $this->social_profiles_helper->set_organization_social_profiles( [ $field_name => $value ] ) === [];
		}

		if ( isset( self::LOGOS[ $field_name ] ) ) {
			return $this->save_logo( $field_name, $value );
		}

		return $this->options_helper->set( $field_name, $value ) === true;
	}

	/**
	 * Saves a logo ID along with its URL, like the media library does in the settings and the first-time configuration.
	 *
	 * The schema reads the logo by its ID, while the settings and the first-time configuration show it by its URL.
	 *
	 * @param string $field_name    The option name of the logo ID.
	 * @param int    $attachment_id The attachment ID of the logo, 0 to clear it.
	 *
	 * @return bool Whether the logo ID was saved.
	 */
	private function save_logo( string $field_name, int $attachment_id ): bool {
		if ( $this->options_helper->set( $field_name, $attachment_id ) !== true ) {
			return false;
		}

		$logo = self::LOGOS[ $field_name ];
		$url  = ( $attachment_id === 0 ) ? '' : $this->image_helper->get_attachment_image_url( $attachment_id, 'full' );

		$this->options_helper->set( $logo, $url );
		// Much like saving the logo from the settings/FTC, let's also clear its meta information so that it can lazily be generated when needed.
		$this->options_helper->set( $logo . '_meta', false );

		return true;
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
			$settings[ $field_name ] = $this->cast_to_schema_type( $this->options_helper->get( $field_name ), $schema );
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
