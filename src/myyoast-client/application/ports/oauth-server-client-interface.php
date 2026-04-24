<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use SensitiveParameter;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;

/**
 * Port for communicating with the OAuth authorization/resource server.
 *
 * Handles DPoP proof injection, nonce management, and authenticated requests.
 */
interface OAuth_Server_Client_Interface {

	/**
	 * Sends an HTTP request with optional DPoP proof injection, nonce retry, and rate limit handling.
	 *
	 * @param string                                       $method  The HTTP method.
	 * @param string                                       $url     The request URL.
	 * @param array<string, string|int|bool|string[]|null> $options Request options: 'headers', 'body', 'timeout', 'dpop' (bool), 'access_token'.
	 *
	 * @return array{status: int, headers: array<string, string>, body: array<string, string|int>|string} The parsed response.
	 */
	public function request( string $method, string $url, array $options = [] ): array;

	/**
	 * Sends an authenticated resource request with DPoP proof.
	 *
	 * @param string                                       $method       The HTTP method.
	 * @param string                                       $url          The resource URL.
	 * @param string                                       $access_token The access token.
	 * @param string                                       $token_type   An Auth_Token_Type constant.
	 * @param array<string, string|int|bool|string[]|null> $options      Additional request options.
	 *
	 * @return array{status: int, headers: array<string, string>, body: array<string, string|int>|string} The parsed response.
	 */
	public function authenticated_request(
		string $method,
		string $url,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $access_token,
		string $token_type = Auth_Token_Type::DPOP,
		array $options = []
	): array;
}
