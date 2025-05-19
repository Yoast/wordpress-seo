<?php

namespace Yoast\WP\SEO\AI_Consent\Application;

use RuntimeException;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Consent_Handler
 * Handles the consent given or revoked by the user.
 */
class Consent_Handler {

	/**
	 * The token manager instance.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * Holds the user helper instance.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Class constructor.
	 *
	 * @param Token_Manager $token_manager The token manager.
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( Token_Manager $token_manager, User_Helper $user_helper ) {
		$this->token_manager = $token_manager;
		$this->user_helper = $user_helper;
	}

	/**
	 * Handles consent revoked by deleting the consent user metadata from the database.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function revoke_consent( int $user_id ) {
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );
	}

	/**
	 * Handles consent granted by adding the consent user metadata to the database.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function grant_consent( int $user_id ) {
		$this->user_helper->update_meta( $user_id, '_yoast_wpseo_ai_consent', true );
	}

	/**
	 * Stores the consent given or revoked by the user.
	 *
	 * @param int  $user_id The user ID.
	 * @param bool $consent Whether the consent has been given.
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
	 * @throws RuntimeException Unable to retrieve the access token.
	 */
	public function handle( int $user_id, bool $consent ): void {
		if ( $consent ) {
			// Store the consent at user level.
			$this->grant_consent( $user_id );
		}
		else {
			$this->token_manager->token_invalidate( $user_id );

			// Delete the consent at user level.
			$this->revoke_consent( $user_id );
		}
	}
}
