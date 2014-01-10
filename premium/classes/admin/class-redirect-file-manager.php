<?php

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
	 * Function that creates the WPSEO redirect directory
	 */
	public static function create_upload_dir() {
		// Create the Redirect file dir
		wp_mkdir_p( self::get_dir() );

		// Create the .htaccess file
		if ( ! file_exists( self::get_dir() . '/.htaccess' ) ) {
			@file_put_contents( self::get_dir() . '/.htaccess', "Options -Indexes\ndeny fron all" );
		}

		// Create an empty index.php file
		if ( ! file_exists( self::get_dir() . '/index.php' ) ) {
			@file_put_contents( self::get_dir() . '/index.php', '<?php' . PHP_EOL . '// Silence is golden.' );
		}

		// Create an empty redirect file
		if ( ! file_exists( self::get_file_path() ) ) {
			@file_put_contents( self::get_file_path(), '' );
		}
	}

}