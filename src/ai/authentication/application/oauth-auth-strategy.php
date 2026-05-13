<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Proof_Exception;

/**
 * Authenticates AI requests with a MyYoast-issued, DPoP-bound `client_credentials` access token.
 *
 * Site-wide auth: one admin connects this site to MyYoast once, after which every WP user can use this
 * strategy. The token itself is site-level — the current WP user's id is self-reported in the body for
 * endpoints that need per-user identity.
 *
 * The actual HTTP call goes through Request_Handler / API_Client (same as the Token strategy); only the
 * Authorization header shape and the DPoP proof header differ. On 401/use_dpop_nonce we fetch a fresh
 * nonce and retry once; on 401/invalid_token we clear the cached site token and retry once; if both
 * retries are exhausted we fall back to the Token strategy unless runtime fallback is disabled.
 */
class OAuth_Auth_Strategy implements Auth_Strategy_Interface {

	private const AI_SCOPE = 'service:ai:consume';

	/**
	 * Path prefixes whose handler reads user identity from the request body. We forward the WP user id
	 * for these because the site-level OAuth token is shared across users (client_credentials) and
	 * yoast-ai needs the body field to run per-user license/usage checks.
	 *
	 * The set is deliberately narrow: only POST endpoints that today rely on JWT-encoded user identity
	 * AND build their request body via Suggestions_Provider / the content-planner handlers. The usage
	 * endpoint (/usage/...) is a GET with an empty body — API_Client drops the body for GET requests,
	 * so adding /usage/ here would silently lose the user_id. The yoast-ai team will need to expose
	 * usage identity through a different surface (query parameter or token claim) when the OAuth path
	 * becomes the default; tracked separately from this issue.
	 *
	 * @var string[]
	 */
	private const USER_BOUND_PATH_PREFIXES = [
		'/openai/suggestions/',
		'/content-planner/',
	];

	/**
	 * The MyYoast OAuth client.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The AI request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * The AI API client (used to resolve the full URL for the DPoP proof's htu claim).
	 *
	 * @var API_Client
	 */
	private $api_client;

	/**
	 * The Token strategy, used for runtime fallback when the OAuth path can't authenticate this request.
	 *
	 * @var Token_Auth_Strategy
	 */
	private $token_strategy;

	/**
	 * Constructor.
	 *
	 * @param MyYoast_Client      $myyoast_client  The MyYoast OAuth client.
	 * @param Request_Handler     $request_handler The AI request handler.
	 * @param API_Client          $api_client      The AI API client.
	 * @param Token_Auth_Strategy $token_strategy  The Token strategy for runtime fallback.
	 */
	public function __construct(
		MyYoast_Client $myyoast_client,
		Request_Handler $request_handler,
		API_Client $api_client,
		Token_Auth_Strategy $token_strategy
	) {
		$this->myyoast_client  = $myyoast_client;
		$this->request_handler = $request_handler;
		$this->api_client      = $api_client;
		$this->token_strategy  = $token_strategy;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Request_Handler and MyYoast_Client throw typed exceptions that propagate out.

	/**
	 * Sends a request to the AI API using the MyYoast OAuth + DPoP flow.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response {
		try {
			$token_set = $this->myyoast_client->get_site_token( [ self::AI_SCOPE ] );
		} catch ( Token_Request_Failed_Exception | Token_Storage_Exception $exception ) {
			// Selection-time token issuance failed; fall back to the Token strategy for this request.
			return $this->token_strategy->send( $request, $user );
		}

		return $this->dispatch( $request, $user, $token_set, true, true );
	}

	/**
	 * Dispatches the request with DPoP-bound headers, with bounded retries on auth-related 401s.
	 *
	 * @param Request   $request                       The base request.
	 * @param WP_User   $user                          The WP user.
	 * @param Token_Set $token_set                     The site token to bind.
	 * @param bool      $nonce_retry_available         Whether the use_dpop_nonce retry is still available.
	 * @param bool      $invalid_token_retry_available Whether the invalid_token clear+reissue retry is still available.
	 *
	 * @return Response The parsed response.
	 */
	private function dispatch(
		Request $request,
		WP_User $user,
		Token_Set $token_set,
		bool $nonce_retry_available,
		bool $invalid_token_retry_available
	): Response {
		$decorated_request = $this->decorate( $request, $user, $token_set );

		try {
			return $this->request_handler->handle( $decorated_request );
		} catch ( Unauthorized_Exception $exception ) {
			if ( $nonce_retry_available && $this->is_nonce_challenge( $exception ) ) {
				$this->myyoast_client->store_dpop_nonce( $exception->get_response_headers() );
				return $this->dispatch( $request, $user, $token_set, false, $invalid_token_retry_available );
			}

			if ( $invalid_token_retry_available ) {
				$this->myyoast_client->clear_site_token();
				try {
					$fresh_token = $this->myyoast_client->get_site_token( [ self::AI_SCOPE ] );
				} catch ( Token_Request_Failed_Exception | Token_Storage_Exception $token_exception ) {
					return $this->token_strategy->send( $request, $user );
				}
				return $this->dispatch( $request, $user, $fresh_token, false, false );
			}

			return $this->token_strategy->send( $request, $user );
		} catch ( Forbidden_Exception $exception ) {
			if ( $this->is_insufficient_scope( $exception ) ) {
				// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
				throw new Insufficient_Scope_Exception(
					'INSUFFICIENT_SCOPE',
					$exception->getCode(),
					'INSUFFICIENT_SCOPE',
					$exception,
					$exception->get_response_headers(),
				);
				// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
			}
			throw $exception;
		} catch ( DPoP_Proof_Exception $exception ) {
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
			throw new Bad_Request_Exception( 'DPOP_PROOF_FAILED', 0, 'DPOP_PROOF_FAILED', $exception );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}
	}

	/**
	 * Decorates the request with the OAuth Authorization header, DPoP proof header, and user_id body field.
	 *
	 * @param Request   $request   The base request.
	 * @param WP_User   $user      The WP user.
	 * @param Token_Set $token_set The site token to bind.
	 *
	 * @return Request The decorated request.
	 */
	private function decorate( Request $request, WP_User $user, Token_Set $token_set ): Request {
		$method = $request->is_post() ? 'POST' : 'GET';
		$url    = $this->api_client->get_url( $request->get_action_path() );
		$proof  = $this->myyoast_client->create_dpop_proof( $method, $url, $token_set );

		$decorated = $request->with_added_headers(
			[
				'Authorization' => 'DPoP ' . $token_set->get_access_token(),
				'DPoP'          => $proof,
			],
		);

		if ( $this->is_user_bound_path( $request->get_action_path() ) ) {
			$decorated = $decorated->with_added_body( [ 'user_id' => (string) $user->ID ] );
		}

		return $decorated;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing

	/**
	 * Whether the given action path is in the user-bound set.
	 *
	 * @param string $action_path The action path.
	 *
	 * @return bool True if the path is user-bound.
	 */
	private function is_user_bound_path( string $action_path ): bool {
		foreach ( self::USER_BOUND_PATH_PREFIXES as $prefix ) {
			if ( \strpos( $action_path, $prefix ) === 0 ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Whether the unauthorized response is a DPoP nonce challenge.
	 *
	 * Per RFC 9449 §8, the server signals a nonce challenge with `error="use_dpop_nonce"` in the
	 * WWW-Authenticate header and a fresh nonce in the DPoP-Nonce response header.
	 *
	 * @param Unauthorized_Exception $exception The exception to inspect.
	 *
	 * @return bool True if the response is a nonce challenge.
	 */
	private function is_nonce_challenge( Unauthorized_Exception $exception ): bool {
		$headers = $exception->get_response_headers();
		if ( ! $this->has_header( $headers, 'dpop-nonce' ) ) {
			return false;
		}

		$www_authenticate = $this->get_header_value( $headers, 'www-authenticate' );
		if ( $www_authenticate === null ) {
			return false;
		}

		return \stripos( $www_authenticate, 'use_dpop_nonce' ) !== false;
	}

	/**
	 * Whether the forbidden response is an insufficient_scope error.
	 *
	 * @param Forbidden_Exception $exception The exception to inspect.
	 *
	 * @return bool True if the response indicates missing scope.
	 */
	private function is_insufficient_scope( Forbidden_Exception $exception ): bool {
		if ( \stripos( $exception->get_error_identifier(), 'insufficient_scope' ) !== false ) {
			return true;
		}

		$www_authenticate = $this->get_header_value( $exception->get_response_headers(), 'www-authenticate' );
		return ( $www_authenticate !== null && \stripos( $www_authenticate, 'insufficient_scope' ) !== false );
	}

	/**
	 * Whether the headers contain the given header name.
	 *
	 * Keys are already lower-cased upstream by Response_Parser::normalize_headers(), so callers must
	 * pass the lower-cased name they expect.
	 *
	 * @param array<string, string|array<string>> $headers The (normalized) headers.
	 * @param string                              $name    The header name (lower-case).
	 *
	 * @return bool True if the header is present and non-empty.
	 */
	private function has_header( array $headers, string $name ): bool {
		return ( $this->get_header_value( $headers, $name ) !== null );
	}

	/**
	 * Returns the value of the given header, or null if missing/empty.
	 *
	 * Keys are already lower-cased upstream by Response_Parser::normalize_headers(), so callers must
	 * pass the lower-cased name they expect — same convention HTTP_Client follows for `retry-after`.
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
