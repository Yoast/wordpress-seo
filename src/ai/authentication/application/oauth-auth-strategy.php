<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Proof_Exception;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Authenticates AI requests with a MyYoast-issued, DPoP-bound `client_credentials` access token.
 *
 * Pure decorator: attaches `Authorization: DPoP <token>` + a matching `DPoP` proof header and a
 * `user_id` body field on user-bound paths. The sender owns dispatch + retry orchestration.
 *
 * Site-wide auth: one admin connects this site to MyYoast once, after which every WP user can use
 * this strategy. The token itself is site-level — the current WP user's id is self-reported in the
 * body for endpoints that need per-user identity.
 *
 * Recovery (`on_failure`): on a DPoP nonce challenge we stash the server-issued nonce so the next
 * decorate() picks it up; on any other 401 we clear the cached site token so the next decorate()
 * fetches a fresh one; on a 403 insufficient_scope we throw a typed exception that bypasses fallback.
 */
class OAuth_Auth_Strategy implements Auth_Strategy_Interface, LoggerAwareInterface {

	use LoggerAwareTrait;

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
	 * The AI API client (used to resolve the full URL for the DPoP proof's htu claim).
	 *
	 * @var API_Client
	 */
	private $api_client;

	/**
	 * Constructor.
	 *
	 * @param MyYoast_Client $myyoast_client The MyYoast OAuth client.
	 * @param API_Client     $api_client     The AI API client.
	 */
	public function __construct( MyYoast_Client $myyoast_client, API_Client $api_client ) {
		$this->myyoast_client = $myyoast_client;
		$this->api_client     = $api_client;
		$this->logger         = new NullLogger();
	}

	/**
	 * Decorates the request with the OAuth Authorization header, DPoP proof header, and (for user-
	 * bound paths) the user_id body field.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Request The decorated request.
	 *
	 * @throws Bad_Request_Exception When site-token issuance or DPoP proof generation fails.
	 */
	public function decorate( Request $request, WP_User $user ): Request {
		try {
			$token_set = $this->myyoast_client->get_site_token( [ self::AI_SCOPE ] );
		} catch ( Token_Request_Failed_Exception | Token_Storage_Exception $exception ) {
			$this->logger->warning( 'OAuth decorate: site token unavailable ({error}); surfacing as OAUTH_TOKEN_UNAVAILABLE.', [ 'error' => $exception->getMessage() ] );
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
			throw new Bad_Request_Exception( 'OAUTH_TOKEN_UNAVAILABLE', 0, 'OAUTH_TOKEN_UNAVAILABLE', $exception );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		$method = $request->is_post() ? 'POST' : 'GET';
		$url    = $this->api_client->get_url( $request->get_action_path() );

		try {
			$proof = $this->myyoast_client->create_dpop_proof( $method, $url, $token_set );
		} catch ( DPoP_Proof_Exception $exception ) {
			$this->logger->warning( 'OAuth decorate: DPoP proof generation failed ({error}); surfacing as DPOP_PROOF_FAILED.', [ 'error' => $exception->getMessage() ] );
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
			throw new Bad_Request_Exception( 'DPOP_PROOF_FAILED', 0, 'DPOP_PROOF_FAILED', $exception );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

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

	/**
	 * Recovery hook called by the sender after a failed dispatch.
	 *
	 * Recovery decisions are driven entirely by the exception type — `$request`, `$user`, and
	 * `$attempt` are part of the interface contract but not used here. The sender owns the retry
	 * budget (MAX_ATTEMPTS = 3), so this method never needs to count its own attempts.
	 *
	 * @param Request                  $request   The base request.
	 * @param WP_User                  $user      The WP user.
	 * @param Remote_Request_Exception $exception The exception from the failed dispatch.
	 * @param int                      $attempt   The 1-based attempt counter.
	 *
	 * @return bool True to retry, false to give up.
	 *
	 * @throws Insufficient_Scope_Exception When the response is a 403 insufficient_scope, so the sender propagates without falling back.
	 * @throws OAuth_Forbidden_Exception    When the response is any other 403 on the OAuth wire; bypasses fallback and consent-revoke flow.
	 */
	public function on_failure( Request $request, WP_User $user, Remote_Request_Exception $exception, int $attempt ): bool { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter,VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- See method docblock.
		if ( $exception instanceof Forbidden_Exception ) {
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception data, not output.
			if ( $this->is_insufficient_scope( $exception ) ) {
				$this->logger->warning( 'OAuth on_failure: yoast-ai returned insufficient_scope; surfacing without fallback.' );
				throw new Insufficient_Scope_Exception(
					'INSUFFICIENT_SCOPE',
					$exception->getCode(),
					'INSUFFICIENT_SCOPE',
					$exception,
					$exception->get_response_headers(),
				);
			}
			// Plain 403 on the OAuth wire isn't a "consent revoked" — that's a Token-flow concept.
			// Translate to a typed exception so the sender bypasses fallback and callers don't
			// auto-revoke consent on the user's behalf.
			$this->logger->warning( 'OAuth on_failure: yoast-ai returned forbidden ({error_id}); surfacing without fallback.', [ 'error_id' => $exception->get_error_identifier() ] );
			throw new OAuth_Forbidden_Exception(
				$exception->getMessage(),
				$exception->getCode(),
				$exception->get_error_identifier(),
				$exception,
				$exception->get_response_headers(),
			);
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		if ( ! ( $exception instanceof Unauthorized_Exception ) ) {
			return false;
		}

		if ( $this->is_nonce_challenge( $exception ) ) {
			$this->logger->debug( 'OAuth on_failure: DPoP nonce challenge received; stashing nonce and retrying.' );
			$this->myyoast_client->store_dpop_nonce( $exception->get_response_headers() );
			return true;
		}

		$this->logger->debug( 'OAuth on_failure: 401 from yoast-ai; clearing cached site token and retrying.' );
		$this->myyoast_client->clear_site_token();
		return true;
	}

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
		if ( $this->get_header_value( $headers, 'dpop-nonce' ) === null ) {
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
	 * Returns the value of the given header, or null if missing/empty.
	 *
	 * Keys are already lower-cased upstream by Response_Parser::normalize_headers(), so callers must
	 * pass the lower-cased name they expect.
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
