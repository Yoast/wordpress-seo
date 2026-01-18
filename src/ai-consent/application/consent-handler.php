<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Consent\Application;

use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Consent_Handler
 * Handles the consent given or revoked by the user.
 *
 * @deprecated 26.3
 * @codeCoverageIgnore
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
	 * Class constructor.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( User_Helper $user_helper ) {
		$this->user_helper = $user_helper;
	}

	/**
	 * Handles consent revoked by deleting the consent user metadata from the database.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function revoke_consent( int $user_id ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Application\Consent_Handler::revoke_consent' );

		$this->user_helper->delete_meta( $user_id, '_yoast_wpseo_ai_consent' );
	}

	/**
	 * Handles consent granted by adding the consent user metadata to the database.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function grant_consent( int $user_id ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Application\Consent_Handler::grant_consent' );

		$this->user_helper->update_meta( $user_id, '_yoast_wpseo_ai_consent', true );
	}
}
