<?php

namespace Yoast\WP\SEO\AI_Authorization\Infrastructure;

/**
 * Interface Token_Repository_Interface
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
interface Token_User_Meta_Repository_Interface {

	/**
	 * Get the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The token data.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_token( int $user_id ): string;

	/**
	 * Store the token for a user.
	 *
	 * @param int    $user_id The user ID.
	 * @param string $value   The token value.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function store_token( int $user_id, string $value ): void;

	/**
	 * Delete the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function delete_token( int $user_id ): void;
}
