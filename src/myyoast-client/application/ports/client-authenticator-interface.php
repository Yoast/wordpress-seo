<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Client_Authentication_Exception;

/**
 * Port for OAuth client authentication (private_key_jwt).
 */
interface Client_Authenticator_Interface {

	/**
	 * Creates a signed client_assertion JWT for the given audience.
	 *
	 * @param string $client_id The registered client_id.
	 * @param string $audience  The audience URL (typically the token endpoint).
	 *
	 * @return string The signed client_assertion JWT.
	 *
	 * @throws Client_Authentication_Exception If key retrieval or signing fails.
	 */
	public function create_client_assertion( string $client_id, string $audience ): string;
}
