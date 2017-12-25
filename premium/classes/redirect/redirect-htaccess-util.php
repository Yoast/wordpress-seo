<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Htaccess
 */
class WPSEO_Redirect_Htaccess_Util {

	/**
	 * Clear the WPSEO added entries added in the .htaccess file
	 */
	public static function clear_htaccess_entries() {

		$htaccess = '';
		if ( file_exists( self::get_htaccess_file_path() ) ) {
			$htaccess = file_get_contents( self::get_htaccess_file_path() );
		}

		$cleaned = preg_replace( '`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS' . PHP_EOL . '`is', '', $htaccess );
		// If nothing changed, don't even try to save it.
		if ( $cleaned === $htaccess ) {
			return;
		}

		WPSEO_Redirect_File_Util::write_file( self::get_htaccess_file_path(), $cleaned );
	}

	/**
	 * Get the full path to the .htaccess file
	 *
	 * @return string
	 */
	public static function get_htaccess_file_path() {
		if ( ! function_exists( 'get_home_path' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		return get_home_path() . '.htaccess';
	}
}
