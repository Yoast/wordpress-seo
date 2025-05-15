<?php

namespace Yoast\WP\SEO\AI_Generator\Infrastructure;

/**
 * Interface Token_Repository_Interface
 */
interface Token_User_Meta_Repository_Interface {

	/**
	 * Get the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The token data.
	 */
	public function get_token( int $user_id ): string;

	/**
	 * Store the token for a user.
	 *
	 * @param int    $user_id    The user ID.
	 * @param string $value      The token value.
	 * @param int    $expiration The expiration time.
	 *
	 * @return void
	 */
	public function store_token( int $user_id, string $value, int $expiration ): void;

	/**
	 * Delete the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_token( int $user_id ): void;
}
