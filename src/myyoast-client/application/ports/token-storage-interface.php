<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Port for site-level token persistence.
 *
 * Tokens are bucketed by RFC 8707 resource indicator so a site can hold one
 * token per resource server. The null bucket is the default resource.
 */
interface Token_Storage_Interface {

	/**
	 * Retrieves the stored token set for a resource bucket.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return Token_Set|null The token set, or null if not stored.
	 */
	public function get( Resource_Indicator $resource_indicator ): ?Token_Set;

	/**
	 * Stores a token set. The resource bucket is derived from the token's own resource indicator.
	 *
	 * @param Token_Set $token_set The token set to store.
	 *
	 * @return void
	 *
	 * @throws Token_Storage_Exception If storage fails.
	 */
	public function store( Token_Set $token_set ): void;

	/**
	 * Deletes the stored token set for a resource bucket.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return void
	 */
	public function delete( Resource_Indicator $resource_indicator ): void;

	/**
	 * Returns every stored token set across resource buckets.
	 *
	 * @return Token_Set[] The stored token sets.
	 */
	public function get_all(): array;

	/**
	 * Deletes every stored token set across resource buckets for the current issuer.
	 *
	 * @return void
	 */
	public function delete_all(): void;

	/**
	 * Deletes every stored token set across all issuers and resource buckets.
	 *
	 * Intended for full plugin cleanup on uninstall, where any token bucket
	 * for any issuer that this site ever connected to should be purged.
	 *
	 * @return void
	 */
	public function delete_all_issuers(): void;
}
