<?php
/**
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

		$htaccess = preg_replace( '`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS' . PHP_EOL . '`is', '', $htaccess );

		// Get the $wp_filesystem object.
		$wp_filesystem = self::get_wp_filesystem_object();

		// Check if the $wp_filesystem is correct.
		if ( null !== $wp_filesystem ) {
			// Update the .htaccess file.
			$wp_filesystem->put_contents(
				self::get_htaccess_file_path(),
				$htaccess,
				FS_CHMOD_FILE // Predefined mode settings for WP files.
			);
		}
	}

	/**
	 * Get the full path to the .htaccess file
	 *
	 * @return string
	 */
	public static function get_htaccess_file_path() {
		return get_home_path() . '.htaccess';
	}

	/**
	 * Initiate and returns the $wp_filesystem object
	 *
	 * @return WP_Filesystem_Base|null
	 */
	public static function get_wp_filesystem_object() {
		global $wp_filesystem;

		// Set the filesystem URL.
		$url = wp_nonce_url( 'admin.php?page=wpseo_redirects#top#settings', 'update-htaccess' );

		// Get the credentials.
		$credentials = request_filesystem_credentials( $url, '', false, self::get_htaccess_file_path() );

		// Return $wp_filesystem if everything is working.
		if ( WP_Filesystem( $credentials, self::get_htaccess_file_path() ) ) {
			return $wp_filesystem;
		}

		// Return null if the WP_Filesystem() check failed.
		return null;
	}
}
