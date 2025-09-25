<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Infrastructure;

/**
 * Interface Token_Repository_Interface
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
interface Token_User_Meta_Repository_Interface {

	/**
	 * Get the token for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The token data.
	 */
	public function get_token( int $user_id ): string;

	/**
	 * Store the token for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int    $user_id The user ID.
	 * @param string $value   The token value.
	 *
	 * @return void
	 */
	public function store_token( int $user_id, string $value ): void;

	/**
	 * Delete the token for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_token( int $user_id ): void;
}
