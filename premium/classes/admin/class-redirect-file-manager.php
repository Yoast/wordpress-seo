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
		return self::get_dir() . '/redirects.conf';
	}

	/**
	 * Function that creates the WPSEO redirect directory
	 */
	public static function create_upload_dir() {
		// Create the Redirect file dir
		wp_mkdir_p( self::get_dir() );

		// Create an empty .htaccess file
		if ( ! file_exists( self::get_file_dir() . '/.htaccess' ) ) {
			@file_put_contents( self::get_file_dir() . '/.htaccess', '' );
		}

		// Create an empty index.php file
		if ( ! file_exists( self::get_file_dir() . '/index.php' ) ) {
			@file_put_contents( self::get_file_dir() . '/index.php', '' );
		}

		// Create an empty redirect file
		if ( ! file_exists( self::get_file_path() ) ) {
			@file_put_contents( self::get_file_path(), '' );
		}
	}

}