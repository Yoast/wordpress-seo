<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;

/**
 * Primary facade for the MyYoast OAuth client.
 *
 * Orchestrates registration, token lifecycle, and authenticated requests.
 * This is the main entry point for consuming code.
 */
class MyYoast_Client {

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * MyYoast_Client constructor.
	 *
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 */
	public function __construct(
		Client_Registration_Interface $client_registration
	) {
		$this->client_registration = $client_registration;
	}

	/**
	 * Ensures the plugin is registered as an OAuth client.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register with.
	 *
	 * @return Registered_Client The registered client.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function ensure_registered( array $redirect_uris = [] ): Registered_Client {
		return $this->client_registration->ensure_registered( $redirect_uris );
	}

	/**
	 * Whether the plugin is registered as an OAuth client.
	 *
	 * @param string[] $redirect_uris Optional redirect URIs to verify against the stored registration.
	 *
	 * @return bool
	 */
	public function is_registered( array $redirect_uris = [] ): bool {
		return $this->client_registration->is_registered( $redirect_uris );
	}

	/**
	 * Reads the current client registration from the server.
	 *
	 * @return array<string, string|string[]> The registration metadata.
	 *
	 * @throws Registration_Failed_Exception If the read fails.
	 */
	public function verify_registration(): array {
		return $this->client_registration->read_registration();
	}

	/**
	 * Deletes the client registration from the server and clears local data.
	 *
	 * @return bool True if deleted or not registered, false on network failure.
	 */
	public function deregister(): bool {
		return $this->client_registration->deregister();
	}

	/**
	 * Rotates the registration key pair.
	 *
	 * @return Registered_Client The updated credentials.
	 *
	 * @throws Registration_Failed_Exception If the rotation fails.
	 */
	public function rotate_registration_keys(): Registered_Client {
		return $this->client_registration->rotate_registration_keys();
	}

	/**
	 * Rotates the DPoP key pair.
	 *
	 * @return void
	 */
	public function rotate_dpop_keys(): void {
		$this->client_registration->rotate_dpop_keys();
	}
}
