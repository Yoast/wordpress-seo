<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Grants;

/**
 * Grant strategy for the Client Credentials flow (RFC 6749 Section 4.4).
 *
 * Used for site-level tokens without user context.
 * Includes the site URL for site identity.
 */
class Client_Credentials_Grant implements Grant_Interface {

	/**
	 * The scopes to request.
	 *
	 * @var string[]
	 */
	private $scopes;

	/**
	 * The site URL for site identity.
	 *
	 * @var string
	 */
	private $site_url;

	/**
	 * Client_Credentials_Grant constructor.
	 *
	 * @param string[] $scopes   The scopes to request.
	 * @param string   $site_url The site URL.
	 */
	public function __construct( array $scopes, string $site_url ) {
		$this->scopes   = $scopes;
		$this->site_url = $site_url;
	}

	/**
	 * Returns the grant type identifier.
	 *
	 * @return string
	 */
	public function get_grant_type(): string {
		return 'client_credentials';
	}

	/**
	 * Returns the grant-specific parameters.
	 *
	 * @return array<string, string>
	 */
	public function get_grant_params(): array {
		$params = [
			'site_url' => $this->site_url,
		];

		if ( ! empty( $this->scopes ) ) {
			$params['scope'] = \implode( ' ', $this->scopes );
		}

		return $params;
	}
}
