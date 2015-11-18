<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Manager
 */
class WPSEO_Redirect_Upgrade {

	/**
	 * @var array
	 */
	private static $redirect_options = array(
		WPSEO_Redirect_Option::OLD_OPTION_PLAIN => WPSEO_Redirect::FORMAT_PLAIN,
		WPSEO_Redirect_Option::OLD_OPTION_REGEX => WPSEO_Redirect::FORMAT_REGEX,
	);

	/**
	 * Upgrade routine from Yoast SEO premium 1.2.0
	 */
	public static function upgrade_1_2_0() {
		$redirect_import = new WPSEO_Redirect_Import();

		foreach ( self::$redirect_options as $redirect_option_name => $redirect_format ) {
			$old_redirects = $redirect_import->get_from_option( $redirect_option_name );

			foreach ( $old_redirects as $origin => $redirect ) {
				// Check if the redirect is not an array yet.
				if ( ! is_array( $redirect ) ) {
					$redirect_import->add( new WPSEO_Redirect( $origin, $redirect['url'], $redirect['type'], $redirect_format ) );
				}
			}
		}

		// Save and export the redirects.
		$redirect_import->save();
		$redirect_import->export();
	}

	/**
	 * Check if redirects should be imported from the free version
	 *
	 * @since 2.3
	 */
	public static function import_redirects_2_3() {
		$wp_query  = new WP_Query( 'post_type=any&meta_key=_yoast_wpseo_redirect&order=ASC' );

		if ( ! empty( $wp_query->posts ) ) {
			$redirect_import = new WPSEO_Redirect_Import();

			foreach ( $wp_query->posts as $post ) {

				$old_url = '/' . $post->post_name . '/';
				$new_url = get_post_meta( $post->ID, '_yoast_wpseo_redirect', true );

				// Create redirect.
				$redirect_import->add( new WPSEO_Redirect( $old_url, $new_url, 301, WPSEO_Redirect::FORMAT_PLAIN ) );

				// Remove post meta value.
				delete_post_meta( $post->ID, '_yoast_wpseo_redirect' );
			}

			$redirect_import->save();
			$redirect_import->export();
		}
	}


	/**
	 * Upgrade routine to merge plain and regex redirects in a single option.
	 */
	public static function upgrade_3_1() {
		$redirect_import = new WPSEO_Redirect_Import();

		foreach ( self::$redirect_options as $redirect_option_name => $redirect_format ) {
			$old_redirects = $redirect_import->get_from_option( $redirect_option_name );

			foreach ( $old_redirects as $origin => $redirect ) {
				/*
				 *  @todo For release the line below have to be uncommented.
					$redirect_import->add( new WPSEO_Redirect( $origin, $redirect['url'], $redirect['type'], $redirect_format ) );
				 */
			}
		}

		// Saving the redirects to the option.
		$redirect_import->save();
		$redirect_import->export( array( new WPSEO_Redirect_Export_Option() ) );
	}

}
