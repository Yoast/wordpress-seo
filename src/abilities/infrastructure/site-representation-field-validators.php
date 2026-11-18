<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Local_SEO_Active_Conditional $local_seo_active_conditional The Local SEO active conditional.
	 * @param Image_Helper                 $image_helper                 The image helper.
	 * @param Options_Helper               $options_helper               The options helper.
	 */
	public function __construct(
		Local_SEO_Active_Conditional $local_seo_active_conditional,
		Image_Helper $image_helper,
		Options_Helper $options_helper
	) {
		$this->local_seo_active_conditional = $local_seo_active_conditional;
		$this->image_helper                 = $image_helper;
		$this->options_helper               = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The validator shares the signature of a validate_callback, which receives any option value.

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

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Validates that the user to represent is one the current user could pick in the settings.
	 *
	 * 0 clears the setting and the current value can be kept, so neither is looked up.
	 *
	 * @param int $value The ID of the user to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_user_id( int $value ): ?string {
		if ( $value === 0 || $value === $this->options_helper->get( 'company_or_person_user_id' ) ) {
			return null;
		}

		if ( $this->can_select_user( $value ) ) {
			return null;
		}

		// A single warning for both a missing and a disallowed user, so it cannot be used to find out which users exist.
		return \__( 'The user to represent was not changed, because no user that you can select exists with the given ID.', 'wordpress-seo' );
	}

	/**
	 * Checks whether the current user could pick a user to represent in the settings.
	 *
	 * Like the user picker in the settings, which relies on the users REST endpoint, users who cannot list users
	 * can only pick users with published posts, so they cannot make any account, like an administrator's, the
	 * public face of the site.
	 *
	 * @param int $user_id The ID of the user to represent.
	 *
	 * @return bool Whether the user can be picked.
	 */
	private function can_select_user( int $user_id ): bool {
		if ( \get_userdata( $user_id ) === false ) {
			return false;
		}

		// Users and their profiles are shared across the network, so only members can represent this site.
		if ( \is_multisite() && ! \is_user_member_of_blog( $user_id ) ) {
			return false;
		}

		if ( \current_user_can( 'list_users' ) ) {
			return true;
		}

		return $this->has_published_posts( $user_id );
	}

	/**
	 * Checks whether a user has published posts, of the post types the users REST endpoint considers for this.
	 *
	 * @param int $user_id The ID of the user.
	 *
	 * @return bool Whether the user has published posts.
	 */
	private function has_published_posts( int $user_id ): bool {
		return (int) \count_user_posts( $user_id, \get_post_types( [ 'show_in_rest' => true ] ), true ) > 0;
	}

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
