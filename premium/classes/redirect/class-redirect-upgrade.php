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
	 * @var WPSEO_Redirect_Option
	 */
	private static $redirect;

	/**
	 * Upgrade routine from Yoast SEO premium 1.2.0
	 */
	public static function upgrade_1_2_0() {
		// Setting the redirect option class.
		self::$redirect = new WPSEO_Redirect_Option();

		foreach ( self::$redirect_options as $redirect_option => $redirect_format ) {
			$old_redirects = self::$redirect->get_from_option( $redirect_option );

			self::$redirect->set_format( $redirect_format );

			foreach ( $old_redirects as $origin => $redirect ) {
				// Check if the redirect is not an array yet.
				if ( ! is_array( $redirect ) ) {
					self::$redirect->add( $origin, $redirect['url'], $redirect['type'] );
				}
			}
		}

		// Saving the redirects to the option.
		self::$redirect->save();

		// Save the redirect file.
		$redirect_manager = new WPSEO_Redirect_URL_Manager( WPSEO_Redirect_URL_Manager::default_exporters() );
		$redirect_manager->save_redirect_file();
	}

	/**
	 * Upgrade routine to merge plain and regex redirects in a single option.
	 */
	public static function upgrade_3_1() {
		// Setting the redirect option class.
		self::$redirect = new WPSEO_Redirect_Option();

		foreach ( self::$redirect_options as $redirect_option => $redirect_format ) {
			$old_redirects = self::$redirect->get_from_option( $redirect_option );

			self::$redirect->set_format( $redirect_format );

			foreach ( $old_redirects as $origin => $redirect ) {
				self::$redirect->add( $origin, $redirect['url'], $redirect['type'] );
			}
		}

		// Save the redirect file.
		$redirect_manager = new WPSEO_Redirect_URL_Manager( array( new WPSEO_Redirect_File_Option() ) );
		$redirect_manager->save_redirect_file();
	}

}
