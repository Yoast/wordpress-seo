<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Describes where an author schema setting of a user is stored, so the author schema abilities can read and save it
 * without knowing how it is stored.
 */
interface Author_Schema_Field_Repository_Interface {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The settings can hold any user meta value.

	/**
	 * Returns the current value of a setting of a user.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The name of the setting.
	 *
	 * @return mixed The current value, or an empty string when the setting is not set.
	 */
	public function get( int $user_id, string $field_name );

	/**
	 * Sanitizes and saves a setting of a user.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The name of the setting.
	 * @param mixed  $value      The value to save.
	 *
	 * @return bool Whether the value was saved as provided, so false as well when it got sanitized into something else.
	 */
	public function save( int $user_id, string $field_name, $value ): bool;

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
