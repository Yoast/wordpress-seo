<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Htaccess_Redirect_File extends WPSEO_Apache_Redirect_File {

	/**
	 * Save the redirect file
	 *
	 * @return bool
	 */
	public function save_file() {

		// Generate file content
		$file_content = $this->generate_file_content();

		if ( null == $file_content ) {
			return false;
		}

		$file_path = WPSEO_Redirect_File_Manager::get_htaccess_file_path();

		// Read current htaccess
		$htaccess = '';
		if ( file_exists( $file_path ) ) {
			$htaccess = file_get_contents( $file_path );
		}

		$htaccess = preg_replace( "`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS" . PHP_EOL . "`is", "", $htaccess );

		// New Redirects
		$file_content = "# BEGIN YOAST REDIRECTS" . PHP_EOL . "<IfModule mod_rewrite.c>" . PHP_EOL . "RewriteEngine On" . PHP_EOL . $file_content . "</IfModule>" . PHP_EOL . "# END YOAST REDIRECTS" . PHP_EOL;

		// Prepend our redirects to htaccess file
		$htaccess = $file_content . $htaccess;

		// Update the .htaccess file
		if( is_writable( $file_path ) ) {
			return (bool) file_put_contents( $file_path, $htaccess );
		}

		return false;

	}

}