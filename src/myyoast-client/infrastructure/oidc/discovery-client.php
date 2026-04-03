<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Fetches and caches the OpenID Connect discovery document.
 *
 * Discovers all endpoint URLs dynamically from `{issuer}/.well-known/openid-configuration`.
 * Caches the document as a WordPress transient for 24 hours.
 */
class Discovery_Client implements Discovery_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

	private const CACHE_TRANSIENT_PREFIX = 'wpseo_myyoast_oidc_';
	private const CACHE_TTL              = \DAY_IN_SECONDS; // 24 hours.

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * The HTTP client.
	 *
	 * @var HTTP_Client
	 */
	private $http_client;

	/**
	 * In-memory cache of the discovery document.
	 *
	 * @var Discovery_Document|null
	 */
	private $cached_document = null;

	/**
	 * Discovery_Client constructor.
	 *
	 * @param Issuer_Config $issuer_config The issuer configuration.
	 * @param HTTP_Client   $http_client   The HTTP client.
	 */
	public function __construct( Issuer_Config $issuer_config, HTTP_Client $http_client ) {
		$this->issuer_config = $issuer_config;
		$this->http_client   = $http_client;
		$this->logger        = new NullLogger();
	}

	/**
	 * Returns the validated discovery document.
	 *
	 * @return Discovery_Document The validated discovery document.
	 *
	 * @throws Discovery_Failed_Exception  If the document cannot be fetched.
	 * @throws Server_Capability_Exception If the server lacks required capabilities.
	 */
	public function get_document(): Discovery_Document {
		// Check in-memory cache: invalidate if issuer has changed.
		if ( $this->cached_document !== null ) {
			if ( $this->cached_document->get_issuer() === $this->issuer_config->get_issuer_url() ) {
				return $this->cached_document;
			}
			$this->cached_document = null;
		}

		$cached = \get_transient( $this->get_cache_key() );
		if ( \is_array( $cached ) && ! empty( $cached ) ) {
			try {
				$this->cached_document = new Discovery_Document( $cached );
				return $this->cached_document;
			} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
				// Cached data is corrupted or no longer compatible — fetch fresh.
				$this->logger->info( 'Invalidating cached discovery document: {error}', [ 'error' => $e->getMessage() ] );
				\delete_transient( $this->get_cache_key() );
			}
		}

		return $this->fetch_and_cache();
	}

	/**
	 * Invalidates the cached discovery document.
	 *
	 * @return void
	 */
	public function invalidate_cache(): void {
		$this->cached_document = null;
		\delete_transient( $this->get_cache_key() );
	}

	/**
	 * Returns the issuer-specific transient cache key.
	 *
	 * The issuer URL is hashed into the key so that switching issuers
	 * (e.g. via environment variable or filter) naturally causes a cache miss
	 * instead of returning stale data from a different server.
	 *
	 * @return string The transient key.
	 */
	private function get_cache_key(): string {
		return self::CACHE_TRANSIENT_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Fetches the discovery document from the server, validates it, and caches it.
	 *
	 * @return Discovery_Document The validated discovery document.
	 *
	 * @throws Discovery_Failed_Exception If the document cannot be fetched or parsed.
	 */
	private function fetch_and_cache(): Discovery_Document {
		$url    = $this->issuer_config->get_discovery_url();
		$result = $this->http_client->request(
			'GET',
			$url,
			[
				'timeout' => 10,
				'headers' => [ 'Accept' => 'application/json' ],
			],
		);

		if ( $result['status'] === 0 ) {
			$error_message = \is_array( $result['body'] ) ? ( $result['body']['error_description'] ?? '' ) : '';
			throw new Discovery_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Failed to fetch OIDC discovery document from %s: %s', $url, $error_message ),
			);
		}

		if ( $result['status'] !== 200 ) {
			throw new Discovery_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'OIDC discovery returned HTTP %d from %s.', $result['status'], $url ),
			);
		}

		$body = $result['body'];
		if ( ! \is_array( $body ) ) {
			throw new Discovery_Failed_Exception( 'OIDC discovery returned invalid JSON.' );
		}

		$document = new Discovery_Document( $body );

		// OIDC Discovery 1.0 Section 4.1: the issuer in the document must match the expected issuer.
		$expected_issuer = $this->issuer_config->get_issuer_url();
		if ( $document->get_issuer() !== $expected_issuer ) {
			throw new Discovery_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Issuer mismatch: expected %s, got %s.', $expected_issuer, $document->get_issuer() ),
			);
		}

		\set_transient( $this->get_cache_key(), $body, self::CACHE_TTL );
		$this->cached_document = $document;

		return $document;
	}
}
