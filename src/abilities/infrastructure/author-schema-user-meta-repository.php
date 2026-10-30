<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Domain\Author_Schema_Field_Repository_Interface;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Stores an author schema setting as a single user meta value, keyed by the name of the setting, sanitized like
 * the user profile page does.
 */
class Author_Schema_User_Meta_Repository implements Author_Schema_Field_Repository_Interface {

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The sanitization helper.
	 *
	 * @var Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * Constructor.
	 *
	 * @param User_Helper         $user_helper         The user helper.
	 * @param Sanitization_Helper $sanitization_helper The sanitization helper.
	 */
	public function __construct( User_Helper $user_helper, Sanitization_Helper $sanitization_helper ) {
		$this->user_helper         = $user_helper;
		$this->sanitization_helper = $sanitization_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The settings can hold any user meta value.

	/**
	 * Returns the current value of a setting of a user.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The name of the setting, which is its user meta key.
	 *
	 * @return mixed The current value, or an empty string when the setting is not set.
	 */
	public function get( int $user_id, string $field_name ) {
		return $this->user_helper->get_meta( $user_id, $field_name, true );
	}

	/**
	 * Sanitizes and saves a setting of a user.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The name of the setting, which is its user meta key.
	 * @param mixed  $value      The value to save.
	 *
	 * @return bool Whether the value was saved as provided, so false as well when it got sanitized into something else.
	 */
	public function save( int $user_id, string $field_name, $value ): bool {
		$this->user_helper->update_meta( $user_id, $field_name, $this->sanitization_helper->sanitize_text_field( $value ) );

		// Updating user meta also returns false when the value did not change, so the stored value is checked instead.
		return $this->get( $user_id, $field_name ) === $value;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
