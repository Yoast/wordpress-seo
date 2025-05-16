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
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Consent_Handler
 * Handles the consent given or revoked by the user.
 */
class Consent_Handler {

	/**
	 * Holds the token manager instance.
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
	 * @param User_Helper   $user_helper   The user helper.
	 */
	public function __construct( Token_Manager $token_manager, User_Helper $user_helper ) {
		$this->token_manager = $token_manager;
		$this->user_helper   = $user_helper;
	}

	/**
	 * Handles consent revoked.
	 *
	 * By deleting the consent user metadata from the database.
	 * And then throwing a Forbidden_Exception.
	 *
	 * @param int $user_id     The user ID.
	 * @param int $status_code The status code. Defaults to 403.
	 *
	 * @return Forbidden_Exception The Forbidden_Exception.
	 */
	public function handle_consent_revoked( int $user_id, int $status_code = 403 ): Forbidden_Exception {
		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );

		return new Forbidden_Exception( 'CONSENT_REVOKED', $status_code );
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
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws RuntimeException Unable to retrieve the access token.
	 */
	public function consent( int $user_id, bool $consent ): void {
		if ( $consent ) {
			// Store the consent at user level.
			$this->user_helper->update_meta( $user_id, '_yoast_wpseo_ai_consent', true );
		}
		else {
			$this->token_manager->token_invalidate( $user_id );

			// Delete the consent at user level.
			$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );
		}
	}
}
