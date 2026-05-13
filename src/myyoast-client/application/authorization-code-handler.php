<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Exception;
use InvalidArgumentException;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Corrupted_Value_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Authorization_Flow_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\ID_Token_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Authorization_Code_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\ID_Token_Validator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Flow_State;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Manages the Authorization Code + PKCE flow.
 *
 * Builds the authorization URL, stores PKCE/state/nonce in the expiring store,
 * and exchanges the authorization code for tokens via OAuth_Grant_Handler.
 */
class Authorization_Code_Handler implements LoggerAwareInterface {
	use LoggerAwareTrait;

	private const CURRENT_AUTH_FLOW_STATE_KEY = 'myyoast_current_authorization_state';
	private const PKCE_TTL                    = ( \MINUTE_IN_SECONDS * 10 );

	/**
	 * The discovery port.
	 *
	 * @var Discovery_Interface
	 */
	private $discovery;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The OAuth grant handler.
	 *
	 * @var OAuth_Grant_Handler
	 */
	private $grant_handler;

	/**
	 * The ID token validator port.
	 *
	 * @var ID_Token_Validator_Interface
	 */
	private $id_token_validator;

	/**
	 * The expiring store.
	 *
	 * @var Expiring_Store
	 */
	private $expiring_store;

	/**
	 * Authorization_Code_Handler constructor.
	 *
	 * @param Discovery_Interface           $discovery           The discovery port.
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 * @param OAuth_Grant_Handler           $grant_handler       The OAuth grant handler.
	 * @param ID_Token_Validator_Interface  $id_token_validator  The ID token validator port.
	 * @param Expiring_Store                $expiring_store      The expiring store.
	 */
	public function __construct(
		Discovery_Interface $discovery,
		Client_Registration_Interface $client_registration,
		OAuth_Grant_Handler $grant_handler,
		ID_Token_Validator_Interface $id_token_validator,
		Expiring_Store $expiring_store
	) {
		$this->discovery           = $discovery;
		$this->client_registration = $client_registration;
		$this->grant_handler       = $grant_handler;
		$this->id_token_validator  = $id_token_validator;
		$this->expiring_store      = $expiring_store;
		$this->logger              = new NullLogger();
	}

	/**
	 * Builds the authorization URL for the user to visit.
	 *
	 * Generates PKCE challenge, state, and nonce, and stores them in the expiring store.
	 *
	 * @param int         $user_id      The WordPress user ID.
	 * @param string      $redirect_uri The callback redirect URI.
	 * @param string[]    $scopes       The scopes to request.
	 * @param string|null $return_url   The URL to return the user to after authorization completes.
	 *
	 * @return string The authorization URL to redirect the user to.
	 *
	 * @throws Authorization_Flow_Exception If any of the auth flow prerequisites (registration, discovery, random number generation, or state parameter validation) fails.
	 */
	public function get_authorization_url( int $user_id, string $redirect_uri, array $scopes = [], ?string $return_url = null ): string {
		if ( $user_id <= 0 ) {
			throw new Authorization_Flow_Exception( 'invalid_user', 'A valid WordPress user ID is required to start the authorization flow.' );
		}

		try {
			$registered_client = $this->client_registration->ensure_registered( [ $redirect_uri ] );
		} catch ( Registration_Failed_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Authorization_Flow_Exception( 'registration_failed', $e->getMessage(), 0, $e );
		}

		try {
			$auth_endpoint = $this->discovery->get_document()->get_authorization_endpoint();
		} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Authorization_Flow_Exception( 'discovery_failed', $e->getMessage(), 0, $e );
		}

		$requests_openid = \in_array( 'openid', $scopes, true );

		try {
			$code_verifier  = Base64url::encode( \random_bytes( 32 ) );
			$code_challenge = Base64url::encode( \hash( 'sha256', $code_verifier, true ) );
			// State = CSRF protection on the redirect (verified by us on callback).
			$state = Base64url::encode( \random_bytes( 32 ) );
			// Nonce = ID token replay protection per OIDC Core 1.0 Section 3.1.2.1
			// (embedded in the ID token by the server, verified by us to ensure freshness).
			// Only generated when openid scope is requested, as nonces are not permitted otherwise.
			$nonce = ( $requests_openid ) ? Base64url::encode( \random_bytes( 16 ) ) : null;
		} catch ( Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Authorization_Flow_Exception( 'random_failure', 'Failed to generate secure random values.', 0, $e );
		}

		try {
			$flow_state = new Auth_Flow_State( $code_verifier, $state, $nonce, $redirect_uri, $return_url );
		} catch ( InvalidArgumentException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Authorization_Flow_Exception( 'invalid_state', $e->getMessage(), 0, $e );
		}

		$this->expiring_store->persist_for_user(
			self::CURRENT_AUTH_FLOW_STATE_KEY,
			$flow_state->to_array(),
			self::PKCE_TTL,
			$user_id,
		);

		$params = [
			'response_type'         => 'code',
			'client_id'             => $registered_client->get_client_id(),
			'redirect_uri'          => $redirect_uri,
			'scope'                 => \implode( ' ', $scopes ),
			'code_challenge'        => $code_challenge,
			'code_challenge_method' => 'S256',
			'state'                 => $state,
			'prompt'                => 'consent',
		];

		if ( $nonce !== null ) {
			$params['nonce'] = $nonce;
		}

		return $auth_endpoint . '?' . \http_build_query( $params, '', '&', \PHP_QUERY_RFC3986 );
	}

	/**
	 * Exchanges an authorization code for tokens.
	 *
	 * Validates the state parameter (CSRF), exchanges the code for tokens,
	 * and validates the ID token nonce (replay protection) if present.
	 *
	 * @param int    $user_id The WordPress user ID.
	 * @param string $code    The authorization code from the callback.
	 * @param string $state   The state parameter from the callback.
	 *
	 * @return Token_Set The obtained tokens.
	 *
	 * @throws Registration_Failed_Exception|Token_Request_Failed_Exception If client registration or exchange fails.
	 */
	public function exchange_code( int $user_id, string $code, string $state ): Token_Set {
		if ( $user_id <= 0 ) {
			throw new Token_Request_Failed_Exception( 'invalid_user', 'A valid WordPress user ID is required to exchange an authorization code.' );
		}

		$flow_state = $this->get_flow_state( $user_id );

		// Validate state (CSRF protection).
		if ( ! \hash_equals( $flow_state->get_state(), $state ) ) {
			$this->logger->warning( 'Authorization code exchange failed: state parameter mismatch for user {user_id} (potential CSRF).', [ 'user_id' => $user_id ] );
			$this->expiring_store->delete_for_user( self::CURRENT_AUTH_FLOW_STATE_KEY, $user_id );
			throw new Token_Request_Failed_Exception( 'invalid_request', 'State parameter mismatch.' );
		}

		// Clean up the stored flow state.
		$this->expiring_store->delete_for_user( self::CURRENT_AUTH_FLOW_STATE_KEY, $user_id );

		$grant     = new Authorization_Code_Grant( $code, $flow_state->get_redirect_uri(), $flow_state->get_code_verifier() );
		$token_set = $this->grant_handler->request_token( $grant );

		// Validate ID token nonce (replay protection) if an ID token was returned.
		$this->validate_id_token_nonce( $token_set, $flow_state );

		return $token_set;
	}

	/**
	 * Returns the stored return URL for a pending authorization flow.
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return string|null The return URL, or null if not set or no pending flow.
	 */
	public function get_return_url( int $user_id ): ?string {
		try {
			return $this->get_flow_state( $user_id )->get_return_url();
		} catch ( Token_Request_Failed_Exception $e ) {
			return null;
		}
	}

	/**
	 * Validates the nonce claim in the ID token against the stored nonce.
	 *
	 * @param Token_Set       $token_set  The token set containing the ID token.
	 * @param Auth_Flow_State $flow_state The flow state containing the expected nonce.
	 *
	 * @return void
	 *
	 * @throws Token_Request_Failed_Exception If ID token nonce validation fails.
	 */
	private function validate_id_token_nonce( Token_Set $token_set, Auth_Flow_State $flow_state ): void {
		$id_token = $token_set->get_id_token();
		if ( $id_token === null ) {
			return;
		}

		$nonce = $flow_state->get_nonce();
		if ( $nonce === null ) {
			// No nonce was sent (openid scope not requested), skip ID token nonce validation.
			return;
		}

		$registered_client = $this->client_registration->get_registered_client();
		if ( $registered_client === null ) {
			throw new Token_Request_Failed_Exception( 'client_not_registered', 'Client registration not found during ID token validation.' );
		}

		try {
			$this->id_token_validator->validate( $id_token, $registered_client->get_client_id(), $nonce );
		} catch ( ID_Token_Validation_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'invalid_id_token', $e->getMessage(), 0, $e );
		} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'discovery_failed', $e->getMessage(), 0, $e );
		}
	}

	/**
	 * Retrieves and validates the stored flow state for a user.
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return Auth_Flow_State The stored flow state.
	 *
	 * @throws Token_Request_Failed_Exception If no pending authorization is found.
	 */
	private function get_flow_state( int $user_id ): Auth_Flow_State {
		try {
			$stored = $this->expiring_store->get_for_user( self::CURRENT_AUTH_FLOW_STATE_KEY, $user_id );
		} catch ( Key_Not_Found_Exception | Corrupted_Value_Exception $e ) {
			$this->logger->warning( 'No pending authorization flow state found for user {user_id}.', [ 'user_id' => $user_id ] );
			throw new Token_Request_Failed_Exception( 'invalid_request', 'No pending authorization found for this user.' );
		}

		if ( ! \is_array( $stored ) ) {
			$this->logger->warning( 'Stored authorization flow state is not an array for user {user_id}.', [ 'user_id' => $user_id ] );
			throw new Token_Request_Failed_Exception( 'invalid_request', 'No pending authorization found for this user.' );
		}

		try {
			return Auth_Flow_State::from_array( $stored );
		} catch ( InvalidArgumentException $e ) {
			$this->logger->error(
				'Stored authorization state is invalid for user {user_id}: {error}',
				[
					'user_id' => $user_id,
					'error'   => $e->getMessage(),
				],
			);
			throw new Token_Request_Failed_Exception( 'invalid_request', 'Stored authorization state is invalid.' );
		}
	}
}
