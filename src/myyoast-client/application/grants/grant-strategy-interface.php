<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Grants;

/**
 * Interface for OAuth grant type strategies.
 *
 * Each implementation provides the grant-specific parameters for a token
 * endpoint request. The shared logic (client assertion, error handling)
 * is handled by OAuth_Grant_Handler.
 */
interface Grant_Strategy_Interface {

	/**
	 * Returns the OAuth grant type identifier (e.g. "authorization_code").
	 *
	 * @return string
	 */
	public function get_grant_type(): string;

	/**
	 * Returns the grant-specific parameters to merge into the token request body.
	 *
	 * @return array<string, string> The parameters (e.g. code, redirect_uri, refresh_token).
	 */
	public function get_grant_params(): array;
}
