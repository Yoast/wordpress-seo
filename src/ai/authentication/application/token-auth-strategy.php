<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Helpers\User_Helper;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Authenticates AI requests via the legacy `access_jwt` flow.
 *
 * Pure decorator: pulls the per-user JWT from Token_Manager and attaches it as
 * `Authorization: Bearer …`. On a 401 the on_failure hook deletes the stored JWTs and
 * signals retry — preserving the self-healing behaviour that previously lived inline in
 * Suggestions_Provider.
 */
class Token_Auth_Strategy implements Auth_Strategy_Interface, LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The token manager.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Constructor.
	 *
	 * @param Token_Manager $token_manager The token manager.
	 * @param User_Helper   $user_helper   The user helper.
	 */
	public function __construct( Token_Manager $token_manager, User_Helper $user_helper ) {
		$this->token_manager = $token_manager;
		$this->user_helper   = $user_helper;
		$this->logger        = new NullLogger();
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Token_Manager throws a long list of typed exceptions that simply propagate out.

	/**
	 * Decorates the request with `Authorization: Bearer <jwt>`.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Request The decorated request.
	 */
	public function decorate( Request $request, WP_User $user ): Request {
		$token = $this->token_manager->get_or_request_access_token( $user );
		return $request->with_added_headers( [ 'Authorization' => "Bearer $token" ] );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing

	/**
	 * On the first 401, drop the stored JWTs so the next decorate() call fetches fresh ones.
	 *
	 * @param Request                  $request   The base request.
	 * @param WP_User                  $user      The WP user.
	 * @param Remote_Request_Exception $exception The exception from the failed dispatch.
	 * @param int                      $attempt   The 1-based attempt counter.
	 *
	 * @return bool True to retry, false to give up.
	 */
	public function on_failure( Request $request, WP_User $user, Remote_Request_Exception $exception, int $attempt ): bool {
		if ( $attempt !== 1 || ! ( $exception instanceof Unauthorized_Exception ) ) {
			return false;
		}

		$this->logger->debug( 'Token on_failure: 401 received for user {user_id}; clearing stored JWTs and retrying.', [ 'user_id' => $user->ID ] );
		$this->user_helper->delete_meta( $user->ID, '_yoast_wpseo_ai_generator_access_jwt' );
		$this->user_helper->delete_meta( $user->ID, '_yoast_wpseo_ai_generator_refresh_jwt' );
		return true;
	}
}
