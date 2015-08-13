<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_File_Manager
 */
class WPSEO_Redirect_File_Util {

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
	 * Function that creates the WPSEO redirect directory
	 */
	public static function create_upload_dir() {
		// Create the Redirect file dir.
		wp_mkdir_p( self::get_dir() );

		// Create the .htaccess file.
		if ( ! file_exists( self::get_dir() . '/.htaccess' ) ) {
			self::write_file( self::get_dir() . '/.htaccess', "Options -Indexes\ndeny from all" );
		}

		// Create an empty index.php file.
		if ( ! file_exists( self::get_dir() . '/index.php' ) ) {
			self::write_file( self::get_dir() . '/index.php', '<?php' . PHP_EOL . '// Silence is golden.' );
		}

		// Create an empty redirect file.
		if ( ! file_exists( self::get_file_path() ) ) {
			self::write_file( self::get_file_path(), '' );
		}
	}

	/**
	 * Wrapper method for file_put_contents. Catches the result, if result is false add notification.
	 *
	 * @param string $file_path
	 * @param string $file_content
	 *
	 * @return int
	 */
	public static function write_file( $file_path, $file_content ) {
		$has_written = (bool) file_put_contents( $file_path, $file_content );
		if ( $has_written === false ) {
			Yoast_Notification_Center::get()->add_notification(
				new Yoast_Notification(
					sprintf( __( "We're unable to write data to the file %s", 'wordpress-seo-premium' ), $file_path ),
					array( 'type' => 'error', 'id' => md5( $file_path ) )
				)
			);
		}

		return $has_written;
	}

}
