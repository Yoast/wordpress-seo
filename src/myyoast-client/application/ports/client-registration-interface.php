<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;

/**
 * Port for the full OAuth client registration lifecycle.
 */
interface Client_Registration_Interface {

	/**
	 * Ensures the plugin is registered, performing DCR if needed.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register with.
	 *
	 * @return Registered_Client The client credentials.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function ensure_registered( array $redirect_uris = [] ): Registered_Client;

	/**
	 * Returns the stored registered client, or null if not registered.
	 *
	 * @return Registered_Client|null
	 */
	public function get_registered_client(): ?Registered_Client;

	/**
	 * Whether the plugin is registered as an OAuth client.
	 *
	 * When redirect URIs are provided, also verifies that all of them
	 * are included in the stored registration.
	 *
	 * @param string[] $redirect_uris Optional redirect URIs to verify against the stored registration.
	 *
	 * @return bool
	 */
	public function is_registered( array $redirect_uris = [] ): bool;

	/**
	 * Reads the current client registration from the server.
	 *
	 * @return array<string, string|string[]> The registration metadata.
	 *
	 * @throws Registration_Failed_Exception If the read fails.
	 */
	public function read_registration(): array;

	/**
	 * Rotates the registration key pair.
	 *
	 * @return Registered_Client The updated credentials.
	 *
	 * @throws Registration_Failed_Exception If the rotation fails.
	 */
	public function rotate_registration_keys(): Registered_Client;

	/**
	 * Deletes the client registration from the server and clears local data.
	 *
	 * @return bool True if deleted or already not registered, false on network failure.
	 */
	public function deregister(): bool;

	/**
	 * Deletes all local registration data (credentials, key pairs, caches).
	 *
	 * @return void
	 */
	public function delete_local_data(): void;

	/**
	 * Rotates the DPoP key pair (local only, no server coordination).
	 *
	 * @return void
	 */
	public function rotate_dpop_keys(): void;
}
