<?php

class WPSEO_Redirect_File_Manager {

	public static function get_dir() {
		$wp_upload_dir = wp_upload_dir();

		return $wp_upload_dir['basedir'] . '/wpseo-redirects';
	}

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
	}

}