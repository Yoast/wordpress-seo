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
		// Setting the redirect option class.
		$redirect_option = new WPSEO_Redirect_Option();

		foreach ( self::$redirect_options as $redirect_option_name => $redirect_format ) {
			$old_redirects = $redirect_option->get_from_option( $redirect_option_name );

			$redirect_option->set_format( $redirect_format );

			foreach ( $old_redirects as $origin => $redirect ) {
				// Check if the redirect is not an array yet.
				if ( ! is_array( $redirect ) ) {
					$redirect_option->add( new WPSEO_Redirect( $origin, $redirect['url'], $redirect['type'], $redirect_format ) );
				}
			}
		}

		// Saving the redirects to the option.
		$redirect_option->save();

		// Save the redirect file.
		$redirect_manager = new WPSEO_Redirect_URL_Manager();
		$redirect_manager->export_redirects();
	}

	/**
	 * Upgrade routine to merge plain and regex redirects in a single option.
	 */
	public static function upgrade_3_1() {
		// Setting the redirect option class.
		$redirect_option = new WPSEO_Redirect_Option();

		foreach ( self::$redirect_options as $redirect_option_name => $redirect_format ) {
			$old_redirects = $redirect_option->get_from_option( $redirect_option_name );

			$redirect_option->set_format( $redirect_format );

			foreach ( $old_redirects as $origin => $redirect ) {
				$redirect_option->add( new WPSEO_Redirect( $origin, $redirect['url'], $redirect['type'], $redirect_format ) );
			}
		}

		// Saving the redirects to the option.
		$redirect_option->save();

		// Save the redirect file.
		$redirect_manager = new WPSEO_Redirect_URL_Manager();
		$redirect_manager->set_exporters( array( new WPSEO_Redirect_Export_Option() ) );
		$redirect_manager->export_redirects();
	}

}
