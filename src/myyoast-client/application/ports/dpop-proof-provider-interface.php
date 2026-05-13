<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use SensitiveParameter;

/**
 * Port for generating DPoP proofs and tracking server-issued DPoP nonces.
 *
 * Allows external consumers (e.g. the AI module) to attach DPoP-bound headers to outgoing
 * requests without depending on the DPoP_Handler implementation in Infrastructure.
 */
interface DPoP_Proof_Provider_Interface {

	/**
	 * Creates a DPoP proof JWT for the given request.
	 *
	 * @param string      $http_method  The HTTP method (e.g. "POST", "GET").
	 * @param string      $url          The request URL (scheme, host, and path — query/fragment are stripped).
	 * @param string|null $access_token The access token to bind, or null for token-endpoint requests.
	 *
	 * @return string The signed DPoP proof JWT.
	 */
	public function create_proof(
		string $http_method,
		string $url,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		?string $access_token = null
	): string;

	/**
	 * Extracts and stores a DPoP-Nonce from response headers so the next create_proof() call picks it up.
	 *
	 * @param array<string, string|string[]> $response_headers The response headers.
	 *
	 * @return void
	 */
	public function handle_nonce_response( array $response_headers ): void;
}
