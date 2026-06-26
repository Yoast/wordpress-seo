<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Consent\Application;

use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Consent_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
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
	 * The AI request sender factory, used to dispatch the consent calls through the active auth strategy.
	 *
	 * @var AI_Request_Sender_Factory
	 */
	private $ai_request_sender_factory;

	/**
	 * Class constructor.
	 *
	 * @param User_Helper               $user_helper               The user helper.
	 * @param AI_Request_Sender_Factory $ai_request_sender_factory The AI request sender factory.
	 */
	public function __construct(
		User_Helper $user_helper,
		AI_Request_Sender_Factory $ai_request_sender_factory
	) {
		$this->user_helper               = $user_helper;
		$this->ai_request_sender_factory = $ai_request_sender_factory;
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
	 * @throws Consent_Required_Exception      When the AI service responds with a 403 indicating consent is required.
	 * @throws Insufficient_Scope_Exception    When the AI service responds with a 403 insufficient_scope.
	 * @throws Forbidden_Exception             When the AI service responds with any other 403.
	 * @throws Internal_Server_Error_Exception When the AI service responds with 500.
	 * @throws Not_Found_Exception             When the AI service responds with 404.
	 * @throws Payment_Required_Exception      When the AI service responds with 402.
	 * @throws Request_Timeout_Exception       When the AI service responds with 408.
	 * @throws Service_Unavailable_Exception   When the AI service responds with 503.
	 * @throws Too_Many_Requests_Exception     When the AI service responds with 429.
	 * @throws Unauthorized_Exception          When the AI service responds with 401.
	 * @throws WP_Request_Exception            When the underlying WordPress HTTP call fails.
	 * @throws RuntimeException When the user is not found.
	 */
	public function grant_consent( int $user_id ) {
		$user = \get_user_by( 'id', $user_id );
		if ( ! $user instanceof WP_User ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new RuntimeException( "User not found: $user_id" );
		}

		$this->ai_request_sender_factory->create( $user )->grant_consent( $user );

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
	 * @throws Consent_Required_Exception      When the AI service responds with a 403 indicating consent is required.
	 * @throws Insufficient_Scope_Exception    When the AI service responds with a 403 insufficient_scope.
	 * @throws Forbidden_Exception             When the AI service responds with any other 403.
	 * @throws Internal_Server_Error_Exception When the AI service responds with 500.
	 * @throws Not_Found_Exception             When the AI service responds with 404.
	 * @throws Payment_Required_Exception      When the AI service responds with 402.
	 * @throws Request_Timeout_Exception       When the AI service responds with 408.
	 * @throws Service_Unavailable_Exception   When the AI service responds with 503.
	 * @throws Too_Many_Requests_Exception     When the AI service responds with 429.
	 * @throws Unauthorized_Exception          When the AI service responds with 401.
	 * @throws WP_Request_Exception            When the underlying WordPress HTTP call fails.
	 * @throws RuntimeException           When the user is not found.
	 */
	public function revoke_consent( int $user_id ) {
		$user = \get_user_by( 'id', $user_id );
		if ( ! $user instanceof WP_User ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new RuntimeException( "User not found: $user_id" );
		}
		// Local consent is always revoked regardless of remote failures.
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );

		$this->ai_request_sender_factory->create( $user )->revoke_consent( $user );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
