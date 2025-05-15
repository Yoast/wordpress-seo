<?php

namespace Yoast\WP\SEO\AI_Generator\Application;

use RuntimeException;
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
use Yoast\WP\SEO\AI_Generator\infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Generator\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;

class Token_Manager {
	/**
	 * The access token repository.
	 *
	 * @var Access_Token_User_Meta_Repository
	 */
	private $access_token_repository;

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
		User_Helper $user_helper,
		Request_Handler $request_handler
	) {
		$this->access_token_repository = $access_token_repository;
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
	private function token_invalidate( string $user_id ): void {
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
}
