<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Initializer for the social previews.
 */
class WPSEO_Social_Previews {

	/**
	 * Enqueues the assets.
	 */
	public function set_hooks() {
		$this->register_assets();
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Sets the hooks necessary for AJAX
	 */
	public function set_ajax_hooks() {
		add_action( 'wp_ajax_retrieve_image_data_from_url', array( $this, 'ajax_retrieve_image_data_from_url' ) );
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
	 * Retrieves image data from an image URL
	 */
	public function ajax_retrieve_image_data_from_url() {
		$url = filter_input( INPUT_GET, 'imageURL' );

		$attachment_id = $this->retrieve_image_id_from_url( $url );

		if ( $attachment_id ) {
			$image = wp_get_attachment_image_src( $attachment_id, 'full' );

			$result = array(
				'status' => 'success',
				'result' => $image[0],
			);
		}
		else {
			// Pass the original URL for consistency.
			$result = array(
				'status' => 'success',
				'result' => $url,
			);
		}

		wp_die( wp_json_encode( $result ) );
	}

	/**
	 * Determines an attachment ID from a URL which might be an attachment URL
	 *
	 * @link https://philipnewcomer.net/2012/11/get-the-attachment-id-from-an-image-url-in-wordpress/
	 *
	 * @param string $url The URL to retrieve the attachment ID for.
	 *
	 * @return bool|int The attachment ID or false.
	 */
	public function retrieve_image_id_from_url( $url ) {
		global $wpdb;

		$attachment_id = false;

		// Get the upload directory paths.
		$upload_dir_paths = wp_upload_dir();

		// Make sure the upload path base directory exists in the attachment URL, to verify that we're working with a media library image.
		if ( false !== strpos( $url, $upload_dir_paths['baseurl'] ) ) {

			// If this is the URL of an auto-generated thumbnail, get the URL of the original image.
			$url = preg_replace( '/-\d+x\d+(?=\.(jpg|jpeg|png|gif)$)/i', '', $url );

			// Remove the upload path base directory from the attachment URL.
			$url = str_replace( $upload_dir_paths['baseurl'] . '/', '', $url );

			// Finally, run a custom database query to get the attachment ID from the modified attachment URL.
			$attachment_id = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT wposts.ID
						FROM {$wpdb->posts} AS wposts,
							{$wpdb->postmeta} AS wpostmeta
						WHERE wposts.ID = wpostmeta.post_id
							AND wpostmeta.meta_key = '_wp_attached_file'
							AND wpostmeta.meta_value = %s
							AND wposts.post_type = 'attachment'",
					$url
				)
			);
		}

		return (int) $attachment_id;
	}

	/**
	 * Register the required assets.
	 */
	private function register_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version       = $asset_manager->flatten_version( WPSEO_VERSION );

		wp_register_script( 'yoast-social-preview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/yoast-premium-social-preview-' . $version . WPSEO_CSSJS_SUFFIX . '.js', array(
			'jquery',
			'jquery-ui-core',
		), WPSEO_VERSION );

		wp_localize_script( 'yoast-social-preview', 'yoastSocialPreview', $this->localize() );

		$deps = array( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css' );

		wp_register_style( 'yoast-social-preview-css', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/dist/social_preview/yoast-social-preview-390.min.css', $deps, WPSEO_VERSION );
		wp_register_style( 'yoast-premium-social-preview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/dist/premium-social-preview-' . $version . '.min.css', $deps, WPSEO_VERSION );
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
			'website'               => $this->get_website(),
			'uploadImage'           => __( 'Upload image', 'wordpress-seo-premium' ),
			'useOtherImage'         => __( 'Use other image', 'wordpress-seo-premium' ),
			'removeImageButton'     => __( 'Remove image', 'wordpress-seo-premium' ),
			'facebookDefaultImage'  => $options['og_default_image'],
			'i18n'                  => array(
				'help'       => $this->get_help_translations( $social ),
				'helpButton' => array(
					'facebookTitle'       => __( 'Show information about Facebook title', 'wordpress-seo-premium' ),
					'facebookDescription' => __( 'Show information about Facebook description', 'wordpress-seo-premium' ),
					'facebookImage'       => __( 'Show information about Facebook image', 'wordpress-seo-premium' ),
					'twitterTitle'        => __( 'Show information about Twitter title', 'wordpress-seo-premium' ),
					'twitterDescription'  => __( 'Show information about Twitter description', 'wordpress-seo-premium' ),
					'twitterImage'        => __( 'Show information about Twitter image', 'wordpress-seo-premium' ),
				),
				'library'    => $this->get_translations(),
			),
			'facebookNonce'         => wp_create_nonce( 'get_facebook_name' ),
		);
	}

	/**
	 * Gets the help translations.
	 *
	 * @param array $social_field The social fields that are available.
	 *
	 * @return array Translations to be used in the social previews.
	 */
	private function get_help_translations( $social_field ) {
		// Default everything to empty strings.
		$localized = array();

		if ( isset( $social_field['opengraph-title'] ) ) {
			$localized['facebookTitle']       = $social_field['opengraph-title']['description'];
			$localized['facebookDescription'] = $social_field['opengraph-description']['description'];
			$localized['facebookImage']       = $social_field['opengraph-image']['description'];
		}

		if ( isset( $social_field['twitter-title'] ) ) {
			$localized['twitterTitle']       = $social_field['twitter-title']['description'];
			$localized['twitterDescription'] = $social_field['twitter-description']['description'];
			$localized['twitterImage']       = $social_field['twitter-image']['description'];
		}

		return $localized;
	}

	/**
	 * Get the website hostname.
	 *
	 * @return string
	 */
	private function get_website() {
		// We only want the host part of the URL.
		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
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
		$file = plugin_dir_path( WPSEO_FILE ) . 'premium/languages/wordpress-seo-premium-' . WPSEO_Utils::get_user_locale() . '.json';
		if ( file_exists( $file ) ) {
			$file = file_get_contents( $file );
			if ( $file !== false ) {
				return json_decode( $file, true );
			}
		}

		return array();
	}
}
