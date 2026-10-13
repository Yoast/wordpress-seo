<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Port for per-user token persistence.
 *
 * Tokens are bucketed by RFC 8707 resource indicator so a user can hold one
 * token per resource server. The null bucket is the default resource.
 */
interface User_Token_Storage_Interface {

	/**
	 * Retrieves the stored token set for a user and resource bucket.
	 *
	 * @param int                $user_id            The user ID.
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return Token_Set|null The token set, or null if not stored.
	 */
	public function get( int $user_id, Resource_Indicator $resource_indicator ): ?Token_Set;

	/**
	 * Stores a token set for a user. The resource bucket is derived from the token's own resource indicator.
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
	 * Deletes the stored token set for a user and resource bucket.
	 *
	 * @param int                $user_id            The user ID.
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return void
	 */
	public function delete( int $user_id, Resource_Indicator $resource_indicator ): void;

	/**
	 * Returns every stored token set across resource buckets for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Token_Set[] The stored token sets.
	 */
	public function get_all( int $user_id ): array;

	/**
	 * Deletes every stored user token set across all users and resource buckets for the current issuer.
	 *
	 * @return void
	 */
	public function delete_all(): void;

	/**
	 * Deletes every stored user token set across all users, issuers, and resource buckets.
	 *
	 * Intended for full plugin cleanup on uninstall, where any token bucket
	 * for any issuer that this site ever connected to should be purged.
	 *
	 * @return void
	 */
	public function delete_all_issuers(): void;
}
