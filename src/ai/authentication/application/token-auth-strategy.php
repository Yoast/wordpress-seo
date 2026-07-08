<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Authenticates AI requests via the legacy `access_jwt` flow.
 *
 * Pulls the per-user JWT from Token_Manager, attaches it as `Authorization: Bearer …`, and dispatches
 * through the standard AI Request_Handler. On a 401 the stored access + refresh JWTs are dropped and
 * the call is retried once with freshly fetched tokens; a second 401 propagates.
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
	 * The AI request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * Constructor.
	 *
	 * @param Token_Manager   $token_manager   The token manager.
	 * @param Request_Handler $request_handler The AI request handler.
	 */
	public function __construct( Token_Manager $token_manager, Request_Handler $request_handler ) {
		$this->token_manager   = $token_manager;
		$this->request_handler = $request_handler;
		$this->logger          = new NullLogger();
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Token_Manager and Request_Handler throw a long list of typed exceptions that simply propagate out.

	/**
	 * Dispatches the request, retrying once with fresh tokens if the first attempt is rejected as stale.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response {
		try {
			return $this->do_send( $request, $user );
		} catch ( Unauthorized_Exception $exception ) {
			$this->logger->debug( 'Token send: 401 received for user {user_id}; clearing stored JWTs and retrying once.', [ 'user_id' => $user->ID ] );
			$this->token_manager->clear_tokens( (string) $user->ID );

			return $this->do_send( $request, $user );
		}
	}

	/**
	 * Fetches the access token, attaches `Authorization: Bearer <jwt>`, and dispatches via the AI Request_Handler.
	 *
	 * @param Request $request The base request.
	 * @param WP_User $user    The WP user.
	 *
	 * @return Response The parsed response.
	 */
	private function do_send( Request $request, WP_User $user ): Response {
		$token     = $this->token_manager->get_or_request_access_token( $user );
		$decorated = $request->with_added_headers( [ 'Authorization' => "Bearer $token" ] );

		return $this->request_handler->handle( $decorated );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing
}
