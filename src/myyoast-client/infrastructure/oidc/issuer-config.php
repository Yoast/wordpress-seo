<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC;

/**
 * Provides the MyYoast issuer URL, software statement, and initial access token.
 *
 * All values are filterable for development/staging environments.
 *
 * The `SOFTWARE_STATEMENT` and `INITIAL_ACCESS_TOKEN` constants below may
 * appear committed with real, valid values. This is intentional and safe — both
 * values are public by design, not leaked secrets. The full rationale lives in
 * the doc block at the top of `config/grunt/custom-tasks/update-myyoast-credentials.js`.
 *
 * *** Please do NOT file a security report raising that these credentials are publicly accessible. ***
 *
 * If something here seems wrong despite the explanation in that file, talk to
 * the Yoast maintainers first.
 */
class Issuer_Config {

	/**
	 * The default production issuer URL.
	 *
	 * @var string
	 */
	private const DEFAULT_ISSUER_URL = 'https://my.yoast.com';

	/**
	 * Software statement JWT for Dynamic Client Registration.
	 *
	 * Populated by the `update-myyoast-credentials` Grunt task as part of the
	 * `artifact` alias on every build. The task fetches a fresh, version-bound
	 * software statement from MyYoast when a service-account token is available
	 * and falls back to a public version-zero software statement otherwise.
	 *
	 * The value committed in source may reflect the most recently shipped
	 * release or be empty on dev branches; this is intentional. At runtime,
	 * non-production environments override this via the
	 * `wpseo_myyoast_software_statement` filter (see `get_software_statement()`).
	 *
	 * Public-by-design — see the class doc block above.
	 *
	 * @var string
	 */
	private const SOFTWARE_STATEMENT = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6IjMwNTI3ZTlhLWZhMWYtNDhkZS05ZjIzLWUyZGE5MzY0NDE3NiJ9.eyJzb2Z0d2FyZV9pZCI6InlvYXN0L3dvcmRwcmVzcy1zZW8iLCJjbGllbnRfbmFtZSI6IllvYXN0IFNFTyIsImxvZ29fdXJpIjoiaHR0cHM6Ly95b2FzdC5jb20vYXBwL3VwbG9hZHMvMjAyNS8xMS9wcmVtaXVtLnN2ZyIsImNsaWVudF91cmkiOiJodHRwczovL3lvYXN0LmNvbS93b3JkcHJlc3MvcGx1Z2lucy9zZW8vIiwidG9zX3VyaSI6Imh0dHBzOi8veW9hc3QuY29tL3Rlcm1zLW9mLXNlcnZpY2UvIiwicG9saWN5X3VyaSI6Imh0dHBzOi8veW9hc3QuY29tL3ByaXZhY3ktcG9saWN5LyIsImNvbnRhY3RzIjpbInN1cHBvcnRAeW9hc3QuY29tIl0sInNvZnR3YXJlX3ZlcnNpb24iOiIyNy40LVJDMSIsImNsZWFudXBfd2hlbl9pbmFjdGl2ZSI6dHJ1ZSwidG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2QiOiJwcml2YXRlX2tleV9qd3QiLCJpc3MiOiJodHRwczovL215LnlvYXN0LmNvbSIsImF1ZCI6Imh0dHBzOi8vbXkueW9hc3QuY29tIiwianRpIjoiNGNjZTViOTMtYTBkNy00YTMzLTg3YTEtOGZlNGE2MTM1YmRlIiwiaWF0IjoxNzc3ODk2Mzc0fQ.T2SGoy5dTlQWg3QjKapPjMs8zg9o0H-VNrJ7XVYIsjLAVIDXCzlawOFFoCeS5H-XBdb5NYZ95vs6QwhyafEMAQ';

	/**
	 * Initial access token for Dynamic Client Registration.
	 *
	 * Populated by the `update-myyoast-credentials` Grunt task as part of the
	 * `artifact` alias on every build. The task fetches a fresh, initial access
	 * token from MyYoast when a service-account token is available and falls
	 * back to a public version-zero token otherwise.
	 *
	 * The value committed in source may reflect the most recently shipped
	 * release or be empty or v0 on dev branches; this is intentional. At
	 * runtime, non-production environments override this via the
	 * `wpseo_myyoast_initial_access_token` filter (see
	 * `get_initial_access_token()`).
	 *
	 * Public-by-design — see the class doc block above.
	 *
	 * @var string
	 */
	private const INITIAL_ACCESS_TOKEN = 've9nExIVXOXD36NOCTQIjxVUyBybtS9erHqN0NdX6dM';

	/**
	 * Returns the MyYoast issuer URL.
	 *
	 * @return string The issuer URL (without trailing slash).
	 */
	public function get_issuer_url(): string {
		/**
		 * Filters the MyYoast issuer URL.
		 *
		 * @internal
		 *
		 * @param string $issuer_url The issuer URL.
		 */
		return \rtrim( \apply_filters( 'wpseo_myyoast_issuer_url', self::DEFAULT_ISSUER_URL ), '/' );
	}

	/**
	 * Returns the software statement JWT.
	 *
	 * @return string The signed software statement JWT.
	 */
	public function get_software_statement(): string {
		/**
		 * Filters the MyYoast software statement JWT.
		 *
		 * @internal
		 *
		 * @param string $software_statement The software statement JWT.
		 */
		return \apply_filters( 'wpseo_myyoast_software_statement', self::SOFTWARE_STATEMENT );
	}

	/**
	 * Returns the initial access token for Dynamic Client Registration.
	 *
	 * @return string The initial access token.
	 */
	public function get_initial_access_token(): string {
		/**
		 * Filters the MyYoast initial access token.
		 *
		 * @internal
		 *
		 * @param string $initial_access_token The initial access token.
		 */
		return \apply_filters( 'wpseo_myyoast_initial_access_token', self::INITIAL_ACCESS_TOKEN );
	}

	/**
	 * Returns a short hash suffix derived from the issuer URL.
	 *
	 * Used to scope storage keys (options, transients, user meta) to the
	 * current issuer, so that switching issuers isolates all stored data.
	 *
	 * @return string An 8-character hex string.
	 */
	public function get_issuer_key(): string {
		return \substr( \md5( $this->get_issuer_url() ), 0, 8 );
	}

	/**
	 * Returns the OIDC discovery document URL.
	 *
	 * @return string The discovery URL.
	 */
	public function get_discovery_url(): string {
		return $this->get_issuer_url() . '/.well-known/openid-configuration';
	}
}
