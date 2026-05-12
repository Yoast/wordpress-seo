<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Port for site-level token persistence.
 */
interface Token_Storage_Interface {

	/**
	 * Retrieves the stored token set.
	 *
	 * @return Token_Set|null The token set, or null if not stored.
	 */
	public function get(): ?Token_Set;

	/**
	 * Stores a token set.
	 *
	 * @param Token_Set $token_set The token set to store.
	 *
	 * @return void
	 *
	 * @throws Token_Storage_Exception If storage fails.
	 */
	public function store( Token_Set $token_set ): void;

	/**
	 * Deletes the stored token set.
	 *
	 * @return void
	 */
	public function delete(): void;
}
