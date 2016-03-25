<?php
/**
 * @package Premium
 */

/**
 * Initializer for the social previews.
 */
class WPSEO_Social_Previews {

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
		$social__previews_path = plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/dist/social_preview';

		wp_enqueue_style( 'yoast-social-preview-css', $social__previews_path . '/yoast-social-preview.min.css', array(), WPSEO_VERSION );
		wp_enqueue_script( 'yoast-social-preview-js', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/yoast-premium-social-preview' . WPSEO_CSSJS_SUFFIX . '.js', array( 'underscore' ), WPSEO_VERSION );
	}

}
