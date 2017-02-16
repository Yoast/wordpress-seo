<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class representing a list of redirect types.
 */
class WPSEO_Redirect_Types {

	/**
	 * Returns the redirect types.
	 *
	 * @return array Array with the redirect types.
	 */
	public function get() {
		$redirect_types = array(
			'301' => __( '301 Moved Permanently', 'wordpress-seo-premium' ),
			'302' => __( '302 Found', 'wordpress-seo-premium' ),
			'307' => __( '307 Temporary Redirect', 'wordpress-seo-premium' ),
			'410' => __( '410 Content Deleted', 'wordpress-seo-premium' ),
			'451' => __( '451 Unavailable For Legal Reasons', 'wordpress-seo-premium' ),
		);

		return apply_filters( 'wpseo_premium_redirect_types', $redirect_types );
	}
}
