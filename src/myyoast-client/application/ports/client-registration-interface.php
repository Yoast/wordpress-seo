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
	 * Ensures the registration's redirect URIs exactly match the given set.
	 *
	 * Performs DCR when not yet registered; when registered with a different set, updates the
	 * registration in place via RFC 7592 (preserving the client_id) rather than re-registering.
	 *
	 * @param string[] $redirect_uris The exact set of OAuth redirect URIs the registration should have.
	 *
	 * @return Registered_Client The client credentials.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function ensure_registered( array $redirect_uris ): Registered_Client;

	/**
	 * Returns the stored registered client, or null if not registered.
	 *
	 * @return Registered_Client|null
	 */
	public function get_registered_client(): ?Registered_Client;

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

	/**
	 * Whether the given redirect URI has completed the OAuth authorization-code flow on this site.
	 *
	 * Per-URI verification state lives on the stored registration. It is pruned to the current
	 * redirect-URI set whenever the registration's redirect URIs change, and reset when the
	 * registration is forgotten (deregister or full local-data wipe).
	 *
	 * @param string $redirect_uri The redirect URI to check.
	 *
	 * @return bool
	 */
	public function is_uri_validated( string $redirect_uri ): bool;

	/**
	 * Records that the given redirect URI has completed the authorization-code flow.
	 *
	 * Called by the authorization-code handler on every successful exchange; idempotent and a no-op
	 * when the site is not registered.
	 *
	 * @param string $redirect_uri The redirect URI that completed the auth-code flow.
	 *
	 * @return void
	 */
	public function mark_uri_validated( string $redirect_uri ): void;
}
