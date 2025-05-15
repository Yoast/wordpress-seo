<?php

namespace Yoast\WP\SEO\AI_Generator\Application;

use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Request;
use Yoast\WP\SEO\AI_Generator\Infrastructure\Access_Token_User_Meta_Repository;
use  Yoast\WP\SEO\AI_Generator\Infrastructure\Refresh_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Generator\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\AI_Generator\Application\Code_Verifier;
class Token_Manager {
	/**
	 * The access token repository.
	 *
	 * @var Access_Token_User_Meta_Repository
	 */
	private $access_token_repository;

	/**
	 * The refresh token repository.
	 *
	 * @var Refresh_Token_User_Meta_Repository
	 */
	private $refresh_token_repository;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The request handler.
	 *
	 * @var Request_Handler
	 */

	private $request_handler;

	public function __construct(
		Access_Token_User_Meta_Repository $access_token_repository,
		Refresh_Token_User_Meta_Repository $refresh_token_repository,
		User_Helper $user_helper,
		Request_Handler $request_handler
	) {
		$this->access_token_repository = $access_token_repository;
		$this->refresh_token_repository = $refresh_token_repository;
		$this->user_helper             = $user_helper;
		$this->request_handler         = $request_handler;
	}

	/**
	 * Invalidates the access token.
	 *
	 * @param string $user_id The user ID.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws RuntimeException Unable to retrieve the access token.
	 */
	public function token_invalidate( string $user_id ): void {
		try {
			$access_jwt = $this->access_token_repository->get_token( $user_id );
		} catch ( RuntimeException $e ) {
			$access_jwt = '';
		}

		$request_body    = [
			'user_id' => (string) $user_id,
		];
		$request_headers = [
			'Authorization' => "Bearer $access_jwt",
		];

		try {
			//$this->ai_generator_helper->request( '/token/invalidate', $request_body, $request_headers );
			$this->request_handler->handle(
				new Request(
					'/token/invalidate',
					$request_body,
					$request_headers
				)
			);
		} catch ( Unauthorized_Exception | Forbidden_Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Reason: Ignored on purpose.
			// We do nothing in this case, we trust nonce verification and try to remove the user data anyway.
			// I.e. we fallthrough to the same logic as if we got a 200 OK.
		}

		// Delete the stored JWT tokens.
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_generator_access_jwt' );
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' );
	}

	/**
	 * Requests a new set of JWT tokens.
	 *
	 * Requests a new JWT access and refresh token for a user from the Yoast AI Service and stores it in the database
	 * under usermeta. The storing of the token happens in a HTTP callback that is triggered by this request.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 */
	public function token_request( WP_User $user ): void {
		// Ensure the user has given consent.
		if ( $this->user_helper->get_meta( $user->ID, '_yoast_wpseo_ai_consent', true ) !== '1' ) {
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw $this->handle_consent_revoked( $user->ID );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		// Generate a verification code and store it in the database.
		$code_verifier = $this->ai_generator_helper->generate_code_verifier( $user );
		$this->ai_generator_helper->set_code_verifier( $user->ID, $code_verifier );

		$request_body = [
			'service'              => 'openai',
			'code_challenge'       => \hash( 'sha256', $code_verifier ),
			'license_site_url'     => $this->ai_generator_helper->get_license_url(),
			'user_id'              => (string) $user->ID,
			'callback_url'         => $this->ai_generator_helper->get_callback_url(),
			'refresh_callback_url' => $this->ai_generator_helper->get_refresh_callback_url(),
		];

		$this->ai_generator_helper->request( '/token/request', $request_body );

		// The callback saves the metadata. Because that is in another session, we need to delete the current cache here. Or we may get the old token.
		\wp_cache_delete( $user->ID, 'user_meta' );
	}

	/**
	 * Refreshes the JWT access token.
	 *
	 * Refreshes a stored JWT access token for a user with the Yoast AI Service and stores it in the database under
	 * usermeta. The storing of the token happens in a HTTP callback that is triggered by this request.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 * @throws RuntimeException Unable to retrieve the refresh token.
	 */
	public function token_refresh( WP_User $user ): void {
		$refresh_jwt = $this->refresh_token_repository->get_token( $user->ID );

		// Generate a verification code and store it in the database.
		$code_verifier = $this->ai_generator_helper->generate_code_verifier( $user );
		$this->ai_generator_helper->set_code_verifier( $user->ID, $code_verifier );

		$request_body    = [
			'code_challenge' => \hash( 'sha256', $code_verifier ),
		];
		$request_headers = [
			'Authorization' => "Bearer $refresh_jwt",
		];

		$this->ai_generator_helper->request( '/token/refresh', $request_body, $request_headers );

		// The callback saves the metadata. Because that is in another session, we need to delete the current cache here. Or we may get the old token.
		\wp_cache_delete( $user->ID, 'user_meta' );
	}

	/**
	 * Checks whether the token has expired.
	 *
	 * @param string $jwt The JWT.
	 *
	 * @return bool Whether the token has expired.
	 */
	public function has_token_expired( string $jwt ): bool {
		$parts = \explode( '.', $jwt );
		if ( \count( $parts ) !== 3 ) {
			// Headers, payload and signature parts are not detected.
			return true;
		}

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Reason: Decoding the payload of the JWT.
		$payload = \base64_decode( $parts[1] );
		$json    = \json_decode( $payload );
		if ( $json === null || ! isset( $json->exp ) ) {
			return true;
		}

		return $json->exp < \time();
	}
}
