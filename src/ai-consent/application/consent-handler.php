<?php

namespace Yoast\WP\SEO\AI_Consent\Application;

use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Consent_Handler
 * Handles the consent given or revoked by the user, both locally (user meta) and remotely (Yoast AI service).
 *
 * @makePublic
 */
class Consent_Handler implements Consent_Handler_Interface {

	/**
	 * Holds the user helper instance.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The token manager instance.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The request handler instance.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * Class constructor.
	 *
	 * @param User_Helper     $user_helper     The user helper.
	 * @param Token_Manager   $token_manager   The token manager, used to obtain a JWT for the consent endpoints.
	 * @param Request_Handler $request_handler The request handler, used to call the AI service's consent endpoints.
	 */
	public function __construct(
		User_Helper $user_helper,
		Token_Manager $token_manager,
		Request_Handler $request_handler
	) {
		$this->user_helper     = $user_helper;
		$this->token_manager   = $token_manager;
		$this->request_handler = $request_handler;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Records the user's consent on the Yoast AI service and, on success, in the local user meta.
	 *
	 * Transactional: any HTTP-layer exception is propagated and the local meta is left untouched, so
	 * the local and server state stay in sync.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception           When the AI service responds with 400.
	 * @throws Forbidden_Exception             When the AI service responds with 403.
	 * @throws Internal_Server_Error_Exception When the AI service responds with 500.
	 * @throws Not_Found_Exception             When the AI service responds with 404.
	 * @throws Payment_Required_Exception      When the AI service responds with 402.
	 * @throws Request_Timeout_Exception       When the AI service responds with 408.
	 * @throws Service_Unavailable_Exception   When the AI service responds with 503.
	 * @throws Too_Many_Requests_Exception     When the AI service responds with 429.
	 * @throws Unauthorized_Exception          When the AI service responds with 401.
	 * @throws WP_Request_Exception            When the underlying WordPress HTTP call fails.
	 */
	public function grant_consent( int $user_id ) {
		$user = \get_user_by( 'id', $user_id );
		if ( ! $user instanceof WP_User ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new RuntimeException( "User not found: $user_id" );
		}
		$jwt = $this->token_manager->get_or_request_access_token( $user );

		$body = [
			'user_id' => (string) $user_id,
		];

		$this->request_handler->handle(
			new Request( '/user/consent', $body, [ 'Authorization' => "Bearer $jwt" ], Request::METHOD_POST ),
		);

		$this->user_helper->update_meta( $user_id, '_yoast_wpseo_ai_consent', true );
	}

	/**
	 * Revokes the user's consent on the Yoast AI service and clears the local user meta.
	 *
	 * Security-first: the local meta is always cleared before the remote call, so consent is
	 * revoked locally even if the remote DELETE fails. Any HTTP-layer exception is propagated
	 * and its management is deferred to the caller.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception           When the AI service responds with 400.
	 * @throws Forbidden_Exception             When the AI service responds with 403.
	 * @throws Internal_Server_Error_Exception When the AI service responds with 500.
	 * @throws Not_Found_Exception             When the AI service responds with 404.
	 * @throws Payment_Required_Exception      When the AI service responds with 402.
	 * @throws Request_Timeout_Exception       When the AI service responds with 408.
	 * @throws Service_Unavailable_Exception   When the AI service responds with 503.
	 * @throws Too_Many_Requests_Exception     When the AI service responds with 429.
	 * @throws Unauthorized_Exception          When the AI service responds with 401.
	 * @throws WP_Request_Exception            When the underlying WordPress HTTP call fails.
	 */
	public function revoke_consent( int $user_id ) {
		$user = \get_user_by( 'id', $user_id );
		// Local consent is always revoked regardless of remote failures.
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );

		$jwt = $this->token_manager->get_or_request_access_token( $user );

		$this->request_handler->handle(
			new Request( '/user/consent', [], [ 'Authorization' => "Bearer $jwt" ], Request::METHOD_DELETE ),
		);
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
