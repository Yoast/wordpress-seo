<?php

namespace Yoast\WP\SEO\AI_Generator\Application;

use Yoast\WP\SEO\AI_Generator\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Consent_Handler
 * Handles the consent given or revoked by the user.
 */
class Consent_Handler {

	/**
	 * Holds the user helper instance.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Class constructor.
	 *
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( User_Helper $user_helper ) {
		$this->user_helper = $user_helper;
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
}
