<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;

/**
 * Validates the site representation settings of Yoast SEO beyond what their JSON schema covers.
 *
 * Each method is the validate_callback of a field in the site representation field map, and returns a
 * warning when the value cannot be saved, in which case the field is skipped.
 */
class Site_Representation_Field_Validators {

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
	 * @param Local_SEO_Active_Conditional $local_seo_active_conditional The Local SEO active conditional.
	 * @param Image_Helper                 $image_helper                 The image helper.
	 */
	public function __construct(
		Local_SEO_Active_Conditional $local_seo_active_conditional,
		Image_Helper $image_helper
	) {
		$this->local_seo_active_conditional = $local_seo_active_conditional;
		$this->image_helper                 = $image_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The validators share the signature of a validate_callback, which receives any option value.

	/**
	 * Validates the represented entity type.
	 *
	 * Local SEO forces the site to represent an organization when reading the option, so writing "person"
	 * would be undone right away and reported as a failed save.
	 *
	 * @param mixed $value The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_company_or_person( $value ): ?string {
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
	 * @param mixed $value The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_user_id( $value ): ?string {
		if ( empty( $value ) || \get_userdata( $value ) !== false ) {
			return null;
		}

		return \__( 'The user to represent was not changed, because no user exists with the given ID.', 'wordpress-seo' );
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Validates that a logo is cleared or is an image in the media library.
	 *
	 * @param int    $value      The attachment ID of the logo to save.
	 * @param string $field_name The option name of the logo ID.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_logo( int $value, string $field_name ): ?string {
		if ( $value === 0 || $this->image_helper->is_valid_attachment( $value ) ) {
			return null;
		}

		return \sprintf(
			/* translators: %s expands to the name of a setting. */
			\__( 'The %s setting was not changed, because it is not the ID of an image in the media library.', 'wordpress-seo' ),
			$field_name,
		);
	}
}
