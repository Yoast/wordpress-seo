<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Authenticates AI requests via the legacy `access_jwt` flow.
 *
 * Pulls the per-user JWT from Token_Manager, attaches it as a plain `Authorization: Bearer` header, and
 * dispatches via Request_Handler. On a 401 it clears the stored JWTs and retries once — preserving the
 * self-healing behaviour that previously lived inline in Suggestions_Provider.
 */
class Token_Auth_Strategy implements Auth_Strategy_Interface {

	/**
	 * The token manager.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Constructor.
	 *
	 * @param Token_Manager   $token_manager   The token manager.
	 * @param Request_Handler $request_handler The request handler.
	 * @param User_Helper     $user_helper     The user helper.
	 */
	public function __construct(
		Token_Manager $token_manager,
		Request_Handler $request_handler,
		User_Helper $user_helper
	) {
		$this->token_manager   = $token_manager;
		$this->request_handler = $request_handler;
		$this->user_helper     = $user_helper;
	}

	/**
	 * Sends a request to the AI API using the legacy access_jwt flow.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response {
		return $this->dispatch( $request, $user, true );
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Token_Manager and Request_Handler throw a long list of typed exceptions that simply propagate out.

	/**
	 * Dispatches the request, optionally retrying once on a 401 with fresh tokens.
	 *
	 * @param Request $request      The base request.
	 * @param WP_User $user         The WP user.
	 * @param bool    $retry_on_401 Whether to retry once on a 401.
	 *
	 * @return Response The parsed response.
	 */
	private function dispatch( Request $request, WP_User $user, bool $retry_on_401 ): Response {
		$token             = $this->token_manager->get_or_request_access_token( $user );
		$decorated_request = $request->with_added_headers( [ 'Authorization' => "Bearer $token" ] );

		try {
			return $this->request_handler->handle( $decorated_request );
		} catch ( Unauthorized_Exception $exception ) {
			// Stored JWTs are no longer valid; drop them so Token_Manager can re-request from scratch.
			$this->user_helper->delete_meta( $user->ID, '_yoast_wpseo_ai_generator_access_jwt' );
			$this->user_helper->delete_meta( $user->ID, '_yoast_wpseo_ai_generator_refresh_jwt' );

			if ( ! $retry_on_401 ) {
				throw $exception;
			}

			return $this->dispatch( $request, $user, false );
		}
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing
}
