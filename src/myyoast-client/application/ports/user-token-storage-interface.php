<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Port for per-user token persistence.
 */
interface User_Token_Storage_Interface {

	/**
	 * Retrieves the stored token set for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Token_Set|null The token set, or null if not stored.
	 */
	public function get( int $user_id ): ?Token_Set;

	/**
	 * Stores a token set for a user.
	 *
	 * @param int       $user_id   The user ID.
	 * @param Token_Set $token_set The token set to store.
	 *
	 * @return void
	 *
	 * @throws Token_Storage_Exception If storage fails.
	 */
	public function store( int $user_id, Token_Set $token_set ): void;

	/**
	 * Deletes the stored token set for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete( int $user_id ): void;

	/**
	 * Deletes all stored user token sets.
	 *
	 * @return void
	 */
	public function delete_all(): void;
}
