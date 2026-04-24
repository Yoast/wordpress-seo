<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\ID_Token_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;

/**
 * Port for OIDC ID token validation.
 */
interface ID_Token_Validator_Interface {

	/**
	 * Validates an ID token.
	 *
	 * @param string $id_token       The raw ID token JWT.
	 * @param string $client_id      The expected client_id (audience).
	 * @param string $expected_nonce The nonce sent in the authorization request.
	 *
	 * @return array<string, string|int|array<string>> The validated ID token payload (claims).
	 *
	 * @throws ID_Token_Validation_Exception If validation fails.
	 * @throws Discovery_Failed_Exception    If the discovery document cannot be fetched.
	 * @throws Server_Capability_Exception   If the server lacks required capabilities.
	 */
	public function validate( string $id_token, string $client_id, string $expected_nonce ): array;
}
