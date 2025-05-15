<?php

namespace Yoast\WP\SEO\AI_Generator\Application;

use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI_Generator\application\Code_Verifier;
use Yoast\WP\SEO\AI_Generator\Application\Request_Handler;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_Generator\infrastructure\Access_Token_User_Meta_Repository;

use Yoast\WP\SEO\Helpers\User_Helper;

class Authorization_Manager {

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

	/**
	 * The code verifier service.
	 *
	 * @var Code_Verifier
	 */
	private $code_verifier;

	/**
	 * Authorization_Manager constructor.
	 *
	 * @param Access_Token_User_Meta_Repository $access_token_repository The access token repository.
	 * @param User_Helper                       $user_helper             The user helper.
	 * @param Request_Handler                   $request_handler         The request handler.
	 * @param Code_Verifier                     $code_verifier           The code verifier service.
	 */
	public function __construct(
		Access_Token_User_Meta_Repository $access_token_repository,
		User_Helper $user_helper,
		Request_Handler $request_handler,
		Code_Verifier $code_verifier
	) {
		$this->access_token_repository = $access_token_repository;
		$this->user_helper             = $user_helper;
		$this->request_handler         = $request_handler;
		$this->code_verifier           = $code_verifier;
	}

	/**
	 * Retrieves the access token.
	 *
	 * @param WP_User $user The WP user.
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
	 * @throws RuntimeException Unable to retrieve the access or refresh token.
	 * @return string The access token.
	 *
	 */
	protected function get_or_request_access_token( WP_User $user ): string {
		$access_jwt = $this->user_helper->get_meta( $user->ID, '_yoast_wpseo_ai_generator_access_jwt', true );
		if ( ! \is_string( $access_jwt ) || $access_jwt === '' ) {
			$this->token_request( $user );
			$access_jwt = $this->access_token_repository->get_token( $user->ID );
		}
		elseif ( $this->has_token_expired( $access_jwt ) ) {
			try {
				$this->token_refresh( $user );
			} catch ( Unauthorized_Exception $exception ) {
				$this->token_request( $user );
			} catch ( Forbidden_Exception $exception ) {
				// Follow the API in the consent being revoked (Use case: user sent an e-mail to revoke?).
				// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
				throw $this->handle_consent_revoked( $user->ID, $exception->getCode() );
				// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
			}
			$access_jwt = $this->ai_generator_helper->get_access_token( $user->ID );
		}

		return $access_jwt;
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
