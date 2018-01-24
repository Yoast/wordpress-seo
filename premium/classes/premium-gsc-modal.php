<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents a premium Google Search Console modal.
 */
class WPSEO_Premium_GSC_Modal {

	/** @var  WPSEO_Redirect_Manager */
	protected $redirect_manager;

	const EXISTING_REDIRECT_HEIGHT = 160;
	const CREATE_REDIRECT_HEIGHT   = 380;

	/**
	 * Constructor, sets the redirect manager instance.
	 */
	public function __construct() {
		$this->redirect_manager = new WPSEO_Redirect_Manager();
	}

	/**
	 * Returns a GSC modal for the given URL.
	 *
	 * @param string $url The URL to get the modal for.
	 *
	 * @return WPSEO_GSC_Modal Instance of GSC Modal.
	 */
	public function show( $url ) {
		$redirect = $this->redirect_manager->get_redirect( $url );
		if ( $redirect ) {
			return new WPSEO_GSC_Modal(
				dirname( __FILE__ ) . '/views/gsc-redirect-exists.php',
				self::EXISTING_REDIRECT_HEIGHT,
				array(
					'redirect' => $redirect,
					'url'      => $url,
				)
			);
		}

		return new WPSEO_GSC_Modal(
			dirname( __FILE__ ) . '/views/gsc-redirect-create.php',
			self::CREATE_REDIRECT_HEIGHT,
			array(
				'url' => $url,
			)
		);
	}
}
