<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use WPSEO_Utils;
use Yoast\WP\SEO\AI\Authentication\Domain\Exceptions\Auth_Strategy_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Response_Validator;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Consent_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Authenticates AI requests with a MyYoast-issued, DPoP-bound `client_credentials` access token.
 *
 * Delegates the actual HTTP call to `MyYoast_Client::authenticated_request()`, which owns DPoP
 * proof generation, nonce handling, and the use_dpop_nonce auto-retry. This strategy keeps only
 * the AI-specific concerns: scope selection, identifying the WP user on every call (POST → body,
 * GET → query parameter), and translating the HTTP_Response into the AI Response domain object.
 */
class OAuth_Auth_Strategy implements Auth_Strategy_Interface, LoggerAwareInterface {

	use LoggerAwareTrait;

	private const AI_SCOPE = 'service:ai:consume';

	/**
	 * The MyYoast OAuth client.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The AI API client (used to resolve the full URL and pick up the configured timeout).
	 *
	 * @var API_Client
	 */
	private $api_client;

	/**
	 * The response validator.
	 *
	 * @var Response_Validator
	 */
	private $response_validator;

	/**
	 * Constructor.
	 *
	 * @param MyYoast_Client     $myyoast_client     The MyYoast OAuth client.
	 * @param API_Client         $api_client         The AI API client.
	 * @param Response_Validator $response_validator The response validator.
	 */
	public function __construct( MyYoast_Client $myyoast_client, API_Client $api_client, Response_Validator $response_validator ) {
		$this->myyoast_client     = $myyoast_client;
		$this->api_client         = $api_client;
		$this->response_validator = $response_validator;
		$this->logger             = new NullLogger();
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Response_Validator and the OAuth-specific catches throw a wider family than is practical to enumerate.

	/**
	 * Acquires a site token, dispatches via MyYoast_Client::authenticated_request, and translates the response.
	 *
	 * The WP user is identified to yoast-ai on every call because the site-level OAuth token is
	 * shared across users. POST requests carry `user_id` in the body; GET requests carry it as a
	 * query parameter.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Response The parsed response.
	 *
	 * @throws Auth_Strategy_Unavailable_Exception When the site token cannot be acquired, so the sender falls back without claiming the request itself failed.
	 * @throws WP_Request_Exception                On transport failure, matching the error identifier the legacy Token path reports.
	 * @throws Bad_Request_Exception               When the status doesn't match a more specific exception.
	 * @throws Insufficient_Scope_Exception        When the response is a 403 insufficient_scope, so callers can keep consent untouched.
	 * @throws Consent_Required_Exception          When the response is a 403 whose message indicates consent is required, so the sender skips the fallback and the caller can re-prompt.
	 * @throws Forbidden_Exception                 When the response is any other 403; callers revoke consent, same as the legacy path.
	 * @throws Unauthorized_Exception              When the response is a 401 (the cached site token is cleared only when the challenge reports `invalid_token`).
	 * @throws Remote_Request_Exception            When MyYoast_Client::authenticated_request throws for any reason not covered above, including unexpected HTTP responses.
	 */
	public function send( Request $request, WP_User $user ): Response {
		$resource = $this->api_client->get_resource_url();

		try {
			$token_set = $this->myyoast_client->get_site_token( [ self::AI_SCOPE ], $resource );
		} catch ( Token_Request_Failed_Exception | Token_Storage_Exception $exception ) {
			$this->logger->warning( 'OAuth send: site token unavailable ({error}); surfacing as OAUTH_TOKEN_UNAVAILABLE.', [ 'error' => $exception->getMessage() ] );
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
			throw new Auth_Strategy_Unavailable_Exception( 'OAUTH_TOKEN_UNAVAILABLE', 0, 'OAUTH_TOKEN_UNAVAILABLE', $exception );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		$method  = $request->get_http_method();
		$url     = $this->api_client->get_url( $request->get_action_path() );
		$user_id = (string) $user->ID;

		$options = [
			'headers' => \array_merge( $request->get_headers(), [ 'Content-Type' => 'application/json' ] ),
			'timeout' => $this->api_client->get_request_timeout(),
		];

		if ( $method === Request::METHOD_POST ) {
			$body            = \array_merge( $request->get_body(), [ 'user_id' => $user_id ] );
			$options['body'] = WPSEO_Utils::format_json_encode( $body );
		}
		else {
			$url = \add_query_arg( [ 'user_id' => $user_id ], $url );
		}

		$http_response = $this->myyoast_client->authenticated_request( $method, $url, $token_set, $options );

		if ( $http_response->is_transport_failure() ) {
			$this->logger->warning( 'OAuth send: transport failure reaching yoast-ai; surfacing as WP_HTTP_REQUEST_ERROR.' );

			throw new WP_Request_Exception( \esc_html( $http_response->get_body_value( 'error_description', '' ) ) );
		}

		try {
			return $this->response_validator->assert_success( $this->to_response( $http_response ) );
		} catch ( Unauthorized_Exception $exception ) {
			$error_code = $this->error_code( $exception );
			// Only drop the cached token when the challenge says the token itself is the problem
			// (`invalid_token`). A replayed DPoP proof (`invalid_dpop_proof`) or any other 401 leaves
			// a still-valid token in place — discarding it would force a needless re-issue, and the
			// retry must come with a fresh DPoP proof, not a fresh token.
			if ( $error_code === 'invalid_token' ) {
				$this->logger->debug( 'OAuth send: 401 invalid_token from yoast-ai; clearing cached site token before rethrowing.' );
				$this->myyoast_client->clear_site_token( $resource );
			}
			else {
				$this->logger->warning(
					'OAuth send: 401 from yoast-ai ({error_code}: {message}); keeping cached site token.',
					[
						'error_code' => $this->error_label( $error_code ),
						'message'    => $exception->getMessage(),
					],
				);
			}
			throw $exception;
		} catch ( Forbidden_Exception $exception ) {
			if ( $this->is_insufficient_scope( $exception ) ) {
				$this->logger->warning( 'OAuth send: yoast-ai returned insufficient_scope.' );
				// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
				throw new Insufficient_Scope_Exception(
					'INSUFFICIENT_SCOPE',
					$exception->getCode(),
					'INSUFFICIENT_SCOPE',
					$exception,
					$exception->get_response_headers(),
				);
				// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
			}
			if ( $this->is_consent_required( $exception ) ) {
				$this->logger->warning( 'OAuth send: yoast-ai requires user consent.' );
				// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
				throw new Consent_Required_Exception(
					'CONSENT_REQUIRED',
					$exception->getCode(),
					'CONSENT_REQUIRED',
					$exception,
					$exception->get_response_headers(),
				);
				// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
			}
			throw $exception;
		} catch ( Remote_Request_Exception $exception ) {
			$this->logger->warning(
				'OAuth send: remote request failed ({error_code}: {message}); rethrowing.',
				[
					'error_code' => $this->error_label( $this->error_code( $exception ) ),
					'message'    => $exception->getMessage(),
				],
			);
			throw $exception;
		}
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Converts a MyYoast HTTP_Response into the AI Response domain object.
	 *
	 * HTTP_Response already carries a json-decoded body when the upstream returned JSON. For non-200
	 * responses we extract `message`, `error_code`, and (for 402/429) `missing_licenses` from that
	 * decoded body. The body is re-encoded as a JSON string so the AI Response, which expects a
	 * string body, stays consistent with what the legacy Token path produces.
	 *
	 * @param HTTP_Response $http_response The MyYoast HTTP response.
	 *
	 * @return Response The AI domain response.
	 */
	private function to_response( HTTP_Response $http_response ): Response {
		$status  = $http_response->get_status();
		$headers = $http_response->get_headers();
		$body    = $http_response->get_body();

		$message          = '';
		$error_code       = '';
		$missing_licenses = [];

		if ( $status !== 200 && $status !== 0 && \is_array( $body ) ) {
			$message    = (string) ( $body['message'] ?? '' );
			$error_code = (string) ( $body['error_code'] ?? '' );
			if ( $status === 402 || $status === 429 ) {
				$missing_licenses = (array) ( $body['missing_licenses'] ?? [] );
			}
		}

		// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Mirroring the body-encoding convention used elsewhere in the AI path.
		$body_string = \is_array( $body ) ? WPSEO_Utils::format_json_encode( $body ) : (string) $body;

		return new Response( $body_string, $status, $message, $error_code, $missing_licenses, $headers );
	}

	/**
	 * Whether the forbidden response is an insufficient_scope error.
	 *
	 * @param Forbidden_Exception $exception The exception to inspect.
	 *
	 * @return bool True if the response indicates missing scope.
	 */
	private function is_insufficient_scope( Forbidden_Exception $exception ): bool {
		return ( $this->error_code( $exception ) === 'insufficient_scope' );
	}

	/**
	 * Whether the forbidden response means the user's consent is required.
	 *
	 * The yoast-ai consent gate returns a 403 carrying neither an `error_code` nor a
	 * `WWW-Authenticate` challenge — only the free-text message "The consent of the user is required
	 * to perform this action". With no machine-readable discriminator available, the message is the
	 * only signal, so this matches the word "consent" case-insensitively. The check runs only after
	 * the insufficient_scope branch, so a scope failure is never misread as a consent failure.
	 *
	 * @param Forbidden_Exception $exception The exception to inspect.
	 *
	 * @return bool True if the response indicates consent is required.
	 */
	private function is_consent_required( Forbidden_Exception $exception ): bool {
		return ( \stripos( $exception->getMessage(), 'consent' ) !== false );
	}

	/**
	 * Resolves the best available error code for an errored response.
	 *
	 * The body's `error_code` is not guaranteed to be present (the RFC 6750/9449 spec carries the
	 * machine-readable code in the `WWW-Authenticate` challenge instead), so the challenge's `error="…"`
	 * token is preferred and the body `error_code` is the fallback. Returns an empty string when
	 * neither is available.
	 *
	 * @param Remote_Request_Exception $exception The exception to inspect.
	 *
	 * @return string The error code, lower-cased, or an empty string.
	 */
	private function error_code( Remote_Request_Exception $exception ): string {
		$challenge_error = $this->challenge_error( $exception->get_response_headers() );
		if ( $challenge_error !== '' ) {
			return $challenge_error;
		}

		return \strtolower( $exception->get_error_identifier() );
	}

	/**
	 * Returns a log-friendly label for an error code, substituting `unknown` for an empty code.
	 *
	 * @param string $error_code The resolved error code.
	 *
	 * @return string The label to log.
	 */
	private function error_label( string $error_code ): string {
		return ( $error_code === '' ) ? 'unknown' : $error_code;
	}

	/**
	 * Extracts the `error="…"` token from a `WWW-Authenticate` challenge header.
	 *
	 * Parses the RFC 6750 § 3 / RFC 9449 § 7.1 challenge (e.g. `Bearer error="invalid_token"`,
	 * `DPoP error="invalid_dpop_proof"`) and returns the lower-cased code, or an empty string when no
	 * challenge or `error` parameter is present.
	 *
	 * @param array<string, string|array<string>> $headers The (normalized) response headers.
	 *
	 * @return string The challenge error code, lower-cased, or an empty string.
	 */
	private function challenge_error( array $headers ): string {
		$www_authenticate = $this->get_header_value( $headers, 'www-authenticate' );
		if ( $www_authenticate === null ) {
			return '';
		}

		if ( \preg_match( '/error\s*=\s*"([^"]*)"/i', $www_authenticate, $matches ) === 1 ) {
			return \strtolower( $matches[1] );
		}

		return '';
	}

	/**
	 * Returns the value of the given header, or null if missing/empty.
	 *
	 * Keys are already lower-cased by MyYoast HTTP_Client / Response_Parser, so callers pass the
	 * lower-cased name they expect.
	 *
	 * @param array<string, string|array<string>> $headers The (normalized) headers.
	 * @param string                              $name    The header name (lower-case).
	 *
	 * @return string|null The header value, or null.
	 */
	private function get_header_value( array $headers, string $name ): ?string {
		$value = ( $headers[ $name ] ?? null );
		if ( \is_array( $value ) ) {
			$value = \reset( $value );
		}
		return ( \is_string( $value ) && $value !== '' ) ? $value : null;
	}
}
