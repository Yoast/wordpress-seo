<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC;

/**
 * Provides the MyYoast issuer URL, software statement, and initial access token.
 *
 * All values are filterable for development/staging environments.
 * The software statement and initial access token are placeholder constants
 * that must be populated at CI-time.
 */
class Issuer_Config {

	/**
	 * The default production issuer URL.
	 *
	 * @var string
	 */
	private const DEFAULT_ISSUER_URL = 'https://my.yoast.com';

	/**
	 * Placeholder software statement JWT (populated at CI-time).
	 *
	 * @var string
	 */
	private const SOFTWARE_STATEMENT = '';

	/**
	 * Placeholder initial access token (populated at CI-time).
	 *
	 * @var string
	 */
	private const INITIAL_ACCESS_TOKEN = '';

	/**
	 * Returns the MyYoast issuer URL.
	 *
	 * Filterable via `yoast_myyoast_issuer_url` and overridable via
	 * the `YOAST_MYYOAST_ISSUER_URL` environment variable.
	 *
	 * @return string The issuer URL (without trailing slash).
	 */
	public function get_issuer_url(): string {
		$env = \getenv( 'YOAST_MYYOAST_ISSUER_URL' );
		if ( $env !== false && $env !== '' ) {
			return \rtrim( $env, '/' );
		}

		/**
		 * Filters the MyYoast issuer URL.
		 *
		 * @param string $issuer_url The issuer URL.
		 */
		return \rtrim( \apply_filters( 'yoast_myyoast_issuer_url', self::DEFAULT_ISSUER_URL ), '/' );
	}

	/**
	 * Returns the software statement JWT.
	 *
	 * Filterable via `yoast_myyoast_software_statement` and overridable via
	 * the `YOAST_MYYOAST_SOFTWARE_STATEMENT` environment variable.
	 *
	 * @return string The signed software statement JWT.
	 */
	public function get_software_statement(): string {
		$env = \getenv( 'YOAST_MYYOAST_SOFTWARE_STATEMENT' );
		if ( $env !== false && $env !== '' ) {
			return $env;
		}

		/**
		 * Filters the MyYoast software statement JWT.
		 *
		 * @param string $software_statement The software statement JWT.
		 */
		return \apply_filters( 'yoast_myyoast_software_statement', self::SOFTWARE_STATEMENT );
	}

	/**
	 * Returns the initial access token for Dynamic Client Registration.
	 *
	 * Filterable via `yoast_myyoast_initial_access_token` and overridable via
	 * the `YOAST_MYYOAST_INITIAL_ACCESS_TOKEN` environment variable.
	 *
	 * @return string The initial access token.
	 */
	public function get_initial_access_token(): string {
		$env = \getenv( 'YOAST_MYYOAST_INITIAL_ACCESS_TOKEN' );
		if ( $env !== false && $env !== '' ) {
			return $env;
		}

		/**
		 * Filters the MyYoast initial access token.
		 *
		 * @param string $initial_access_token The initial access token.
		 */
		return \apply_filters( 'yoast_myyoast_initial_access_token', self::INITIAL_ACCESS_TOKEN );
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
