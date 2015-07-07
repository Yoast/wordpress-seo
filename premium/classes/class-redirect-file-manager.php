<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_File_Manager
 */
class WPSEO_Redirect_File_Manager {

	/**
	 * Get the full path to the WPSEO redirect directory
	 *
	 * @return string
	 */
	public static function get_dir() {
		$wp_upload_dir = wp_upload_dir();

		return $wp_upload_dir['basedir'] . '/wpseo-redirects';
	}

	/**
	 * Get the full path to the redirect file
	 *
	 * @return string
	 */
	public static function get_file_path() {
		return self::get_dir() . '/.redirects';
	}

	/**
	 * Get the full path to the .htaccess file
	 *
	 * @return bool
	 */
	public static function get_htaccess_file_path() {
		return get_home_path() . '.htaccess';
	}

	/**
	 * Function that creates the WPSEO redirect directory
	 */
	public static function create_upload_dir() {
		// Create the Redirect file dir.
		wp_mkdir_p( self::get_dir() );

		// Create the .htaccess file.
		if ( ! file_exists( self::get_dir() . '/.htaccess' ) ) {
			@file_put_contents( self::get_dir() . '/.htaccess', "Options -Indexes\ndeny from all" );
		}

		// Create an empty index.php file.
		if ( ! file_exists( self::get_dir() . '/index.php' ) ) {
			@file_put_contents( self::get_dir() . '/index.php', '<?php' . PHP_EOL . '// Silence is golden.' );
		}

		// Create an empty redirect file.
		if ( ! file_exists( self::get_file_path() ) ) {
			@file_put_contents( self::get_file_path(), '' );
		}
	}

	/**
	 * Initiate and returns the $wp_filesystem object
	 *
	 * @return $wp_filesystem
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
