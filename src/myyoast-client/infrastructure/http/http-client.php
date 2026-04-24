<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http;

use SensitiveParameter;
use WP_Error;
use WpOrg\Requests\Utility\CaseInsensitiveDictionary;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Corrupted_Value_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Handler;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Proof_Exception;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * HTTP client wrapping WordPress HTTP API with DPoP header injection.
 *
 * Provides automatic DPoP proof generation for all requests and handles
 * `use_dpop_nonce` errors by retrying once with the new nonce.
 */
class HTTP_Client implements OAuth_Server_Client_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

	private const RATE_LIMIT_KEY_PREFIX   = 'myyoast_rate_limit:';
	private const DEFAULT_BACKOFF_SECONDS = \MINUTE_IN_SECONDS;

	/**
	 * The DPoP handler.
	 *
	 * @var DPoP_Handler
	 */
	private $dpop_handler;

	/**
	 * The expiring store for rate limit backoff.
	 *
	 * @var Expiring_Store
	 */
	private $expiring_store;

	/**
	 * HTTP_Client constructor.
	 *
	 * @param DPoP_Handler   $dpop_handler   The DPoP handler.
	 * @param Expiring_Store $expiring_store The expiring store for rate limit tracking.
	 */
	public function __construct( DPoP_Handler $dpop_handler, Expiring_Store $expiring_store ) {
		$this->dpop_handler   = $dpop_handler;
		$this->expiring_store = $expiring_store;
		$this->logger         = new NullLogger();
	}

	/**
	 * Sends an HTTP request with optional DPoP proof.
	 *
	 * @param string                                       $method  The HTTP method.
	 * @param string                                       $url     The request URL.
	 * @param array<string, string|int|bool|string[]|null> $options Request options: 'headers', 'body', 'timeout', 'dpop' (bool), 'access_token'.
	 *
	 * @return HTTP_Response The parsed response.
	 */
	public function request( string $method, string $url, array $options = [] ): HTTP_Response {
		$cached_response = $this->get_cached_rate_limit_response( $url );
		if ( $cached_response !== null ) {
			return $cached_response;
		}

		$result = $this->do_request( $method, $url, $options );

		// Handle DPoP nonce lifecycle when DPoP is active.
		if ( ! empty( $options['dpop'] ) ) {
			$this->dpop_handler->handle_nonce_response( $result->get_headers() );

			// Retry once on use_dpop_nonce error with the fresh nonce.
			if ( $this->is_dpop_nonce_error( $result ) ) {
				$this->logger->debug(
					'Retrying request with fresh DPoP nonce for {method} {url}.',
					[
						'method' => $method,
						'url'    => $url,
					],
				);
				$result = $this->do_request( $method, $url, $options );
				$this->dpop_handler->handle_nonce_response( $result->get_headers() );
			}
		}

		return $result;
	}

	/**
	 * Sends an authenticated resource request with DPoP proof.
	 * Authenticate with a (DPoP bound) access token or refresh token, an Initial Access Token, or a Client Registration Access Token, depending on the token type and endpoint requirements.
	 *
	 * @param string                                       $method       The HTTP method.
	 * @param string                                       $url          The resource URL.
	 * @param string                                       $access_token The access token.
	 * @param string                                       $token_type   An Auth_Token_Type constant.
	 * @param array<string, string|int|bool|string[]|null> $options      Additional request options.
	 *
	 * @return HTTP_Response The parsed response.
	 */
	public function authenticated_request(
		string $method,
		string $url,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $access_token,
		string $token_type = Auth_Token_Type::DPOP,
		array $options = []
	): HTTP_Response {
		$headers = ( $options['headers'] ?? [] );

		$headers['Authorization'] = $token_type . ' ' . $access_token;

		return $this->request(
			$method,
			$url,
			\array_merge(
				$options,
				[
					'headers'      => $headers,
					'dpop'         => ( $token_type === Auth_Token_Type::DPOP ),
					'access_token' => $access_token,
				],
			),
		);
	}

	/**
	 * Checks if the response indicates a use_dpop_nonce error.
	 *
	 * @param HTTP_Response $result The parsed response.
	 *
	 * @return bool Whether this is a DPoP nonce error.
	 */
	private function is_dpop_nonce_error( HTTP_Response $result ): bool {
		return ( $result->get_body_value( 'error' ) === 'use_dpop_nonce' );
	}

	/**
	 * Executes a single HTTP request with optional DPoP proof injection.
	 *
	 * @param string                                       $method  The HTTP method.
	 * @param string                                       $url     The request URL.
	 * @param array<string, string|int|bool|string[]|null> $options Request options.
	 *
	 * @return HTTP_Response The parsed response.
	 */
	private function do_request( string $method, string $url, array $options ): HTTP_Response {
		$headers = ( $options['headers'] ?? [] );
		$timeout = ( $options['timeout'] ?? 10 );

		// Add DPoP proof header if requested.
		if ( ! empty( $options['dpop'] ) ) {
			$access_token = ( $options['access_token'] ?? null );
			try {
				$headers['DPoP'] = $this->dpop_handler->create_proof( $method, $url, $access_token );
			} catch ( DPoP_Proof_Exception $e ) {
				$this->logger->error(
					'DPoP proof generation failed for {method} {url}: {error}',
					[
						'method'                       => $method,
						'url'                          => $url,
						'error'                        => $e->getMessage(),
					],
				);
				return new HTTP_Response(
					0,
					[],
					[
						'error'             => 'dpop_proof_failed',
						'error_description' => $e->getMessage(),
					],
				);
			}
		}

		$wp_args = [
			'method'  => \strtoupper( $method ),
			'headers' => $headers,
			'timeout' => $timeout,
		];

		if ( isset( $options['body'] ) ) {
			$wp_args['body'] = $options['body'];
		}

		$response = \wp_remote_request( $url, $wp_args );

		return $this->parse_response( $response, $url );
	}

	/**
	 * Parses a WordPress HTTP API response into a standardized format.
	 *
	 * @param array<string, string|int|array<string, string>>|WP_Error $response The raw WordPress response.
	 * @param string                                                   $url      The request URL (for error messages).
	 *
	 * @return HTTP_Response The parsed response.
	 */
	private function parse_response( $response, string $url ): HTTP_Response {
		if ( \is_wp_error( $response ) ) {
			$this->logger->warning(
				'Network error for {url}: {error}',
				[
					'url'   => $url,
					'error' => $response->get_error_message(),
				],
			);
			return new HTTP_Response(
				0,
				[],
				[
					'error'             => 'network_error',
					'error_description' => $response->get_error_message(),
				],
			);
		}

		$status  = \wp_remote_retrieve_response_code( $response );
		$headers = \wp_remote_retrieve_headers( $response );
		$body    = \wp_remote_retrieve_body( $response );

		$headers_array = [];
		if ( $headers instanceof CaseInsensitiveDictionary ) {
			$headers_array = (array) $headers->getAll();
		}
		elseif ( \is_array( $headers ) ) {
			$headers_array = $headers;
		}

		$decoded = \json_decode( $body, true );

		$parsed = new HTTP_Response(
			(int) $status,
			$headers_array,
			( \is_array( $decoded ) ? $decoded : $body ),
		);

		if ( (int) $status === 429 ) {
			$this->logger->warning( 'Rate limited (429) by {url}.', [ 'url' => $url ] );
			$this->store_rate_limit_response( $url, $parsed );
		}

		return $parsed;
	}

	/**
	 * Returns a cached 429 response with an updated Retry-After header, or null if not rate limited.
	 *
	 * @param string $url The request URL.
	 *
	 * @return HTTP_Response|null The cached response or null.
	 */
	private function get_cached_rate_limit_response( string $url ): ?HTTP_Response {
		$key = $this->get_rate_limit_key( $url );

		try {
			$cached = $this->expiring_store->get( $key );
		} catch ( Key_Not_Found_Exception | Corrupted_Value_Exception $e ) {
			return null;
		}

		if ( ! \is_array( $cached ) || ! isset( $cached['stored_at'], $cached['backoff_seconds'], $cached['status'], $cached['headers'], $cached['body'] ) ) {
			return null;
		}

		$remaining = ( ( $cached['stored_at'] + $cached['backoff_seconds'] ) - \time() );
		if ( $remaining <= 0 ) {
			return null;
		}

		$headers                = $cached['headers'];
		$headers['retry-after'] = (string) $remaining;

		return new HTTP_Response( (int) $cached['status'], $headers, $cached['body'] );
	}

	/**
	 * Stores a 429 response in the expiring store for later replay.
	 *
	 * @param string        $url      The request URL.
	 * @param HTTP_Response $response The parsed 429 response.
	 *
	 * @return void
	 */
	private function store_rate_limit_response( string $url, HTTP_Response $response ): void {
		$headers     = $response->get_headers();
		$retry_after = ( $headers['retry-after'] ?? null );

		if ( \is_numeric( $retry_after ) ) {
			$backoff_seconds = (int) $retry_after;
		}
		else {
			$backoff_seconds = self::DEFAULT_BACKOFF_SECONDS;
		}

		$this->expiring_store->persist(
			$this->get_rate_limit_key( $url ),
			[
				'stored_at'       => \time(),
				'backoff_seconds' => $backoff_seconds,
				'status'          => $response->get_status(),
				'headers'         => $headers,
				'body'            => $response->get_body(),
			],
			$backoff_seconds,
		);
	}

	/**
	 * Builds a rate limit key from a URL using its host and path.
	 *
	 * @param string $url The request URL.
	 *
	 * @return string The rate limit key.
	 */
	private function get_rate_limit_key( string $url ): string {
		$parsed = \wp_parse_url( $url );
		$host   = ( $parsed['host'] ?? 'unknown' );
		$path   = ( $parsed['path'] ?? '/' );

		return self::RATE_LIMIT_KEY_PREFIX . $host . $path;
	}
}
