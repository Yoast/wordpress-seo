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
		$this->register_assets();
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
		wp_enqueue_style( 'yoast-social-preview-css' );
		wp_enqueue_style( 'yoast-premium-social-preview' );
		wp_enqueue_script( 'yoast-social-preview' );
	}

	/**
	 * Register the required assets.
	 */
	private function register_assets() {
		wp_register_script( 'yoast-social-preview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/yoast-premium-social-preview' . WPSEO_CSSJS_SUFFIX . '.js', array(
			'jquery',
			'jquery-ui-core',
		), WPSEO_VERSION );

		wp_localize_script( 'yoast-social-preview', 'yoastSocialPreview', $this->localize() );

		wp_register_style( 'yoast-social-preview-css', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/dist/social_preview/yoast-social-preview.min.css', array(), WPSEO_VERSION );
		wp_register_style( 'yoast-premium-social-preview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/premium-social-preview.min.css', array(), WPSEO_VERSION );
	}

	/**
	 * Returns the translations.
	 *
	 * @return array
	 */
	private function localize() {
		$options = WPSEO_Options::get_option( 'wpseo_social' );

		if ( empty( WPSEO_Social_Admin::$meta_fields['social']['opengraph-title']['description'] ) ) {
			WPSEO_Social_Admin::translate_meta_boxes();
		}

		$social = WPSEO_Social_Admin::$meta_fields['social'];

		return array(
			'website'              => $this->get_website(),
			'uploadImage'          => __( 'Upload image', 'wordpress-seo-premium' ),
			'useOtherImage'      => __( 'Use other image', 'wordpress-seo-premium' ),
			'removeImageButton'    => __( 'Remove image', 'wordpress-seo-premium' ),
			'facebookDefaultImage' => $options['og_default_image'],
			'i18n'                 => array(
				'help'       => array(
					'facebookTitle'       => $social['opengraph-title']['description'],
					'facebookDescription' => $social['opengraph-description']['description'],
					'facebookImage'       => $social['opengraph-image']['description'],
					'twitterTitle'        => $social['twitter-title']['description'],
					'twitterDescription'  => $social['twitter-description']['description'],
					'twitterImage'        => $social['twitter-image']['description'],
				),
				'helpButton' => array(
					'facebookTitle'       => __( 'Show information about Facebook title', 'wordpress-seo-premium' ),
					'facebookDescription' => __( 'Show information about Facebook description', 'wordpress-seo-premium' ),
					'facebookImage'       => __( 'Show information about Facebook image', 'wordpress-seo-premium' ),
					'twitterTitle'        => __( 'Show information about Twitter title', 'wordpress-seo-premium' ),
					'twitterDescription'  => __( 'Show information about Twitter description', 'wordpress-seo-premium' ),
					'twitterImage'        => __( 'Show information about Twitter image', 'wordpress-seo-premium' ),
				),
				'library' => $this->get_translations(),
			),
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

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'premium/languages/wordpress-seo-premium-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}

		return array();
	}
}
