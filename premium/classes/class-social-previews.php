<?php
/**
 * @package Premium
 */

/**
 * Initializer for the social previews.
 */
class WPSEO_Social_Previews {

	/**
	 * Register the script and localize it.
	 */
	public function __construct() {
		wp_register_script( 'yoast-social-preview-js', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/yoast-premium-social-preview' . WPSEO_CSSJS_SUFFIX . '.js', array( 'underscore' ), WPSEO_VERSION );
		wp_localize_script( 'yoast-social-preview-js', 'yoast_social_preview', $this->localize() );
	}

	/**
	 * Enqueues the assets.
	 */
	public function set_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues the javascript and css files needed for the social previews.
	 */
	public function enqueue_assets() {
		wp_enqueue_style( 'yoast-social-preview-css', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/dist/social_preview/yoast-social-preview.min.css', array(), WPSEO_VERSION );
		wp_enqueue_script( 'yoast-social-preview-js' );
	}

	/**
	 * Returns the translations.
	 * 
	 * @return array
	 */
	private function localize() {
		return array(
			'website' => $this->get_website(),
		);
	}

	/**
	 * Get the website hostname.
	 *
	 * @return string
	 */
	private function get_website() {
		// We only want the host part of the url.
		$website = parse_url( home_url(), PHP_URL_HOST );
		$website = trim( $website, '/' );
		$website = strtolower( $website );

		return $website;
	}

}
