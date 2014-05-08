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
		global $wp_filesystem;

		// Generate file content
		$file_content = $this->generate_file_content();

		if ( null == $file_content ) {
			return false;
		}

		// Set the filesystem URL
		$url = wp_nonce_url( 'admin.php?page=wpseo_redirects#top#settings', 'update-htaccess' );

		// Get the credentials
		$credentials = request_filesystem_credentials( $url, '', false, WPSEO_Redirect_File_Manager::get_htaccess_file_path() );

		// Check if WP_Filesystem is working
		if ( WP_Filesystem( $credentials, WPSEO_Redirect_File_Manager::get_htaccess_file_path() ) ) {

			// Read current htaccess
			$htaccess = '';
			if ( file_exists( WPSEO_Redirect_File_Manager::get_htaccess_file_path() ) ) {
				$htaccess = file_get_contents( WPSEO_Redirect_File_Manager::get_htaccess_file_path() );
			}

			$htaccess = preg_replace( "`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS" . PHP_EOL . "`is", "", $htaccess );

			// New Redirects
			$file_content = "# BEGIN YOAST REDIRECTS" . PHP_EOL . "<IfModule mod_rewrite.c>" . PHP_EOL . "RewriteEngine On" . PHP_EOL . $file_content . "</IfModule>" . PHP_EOL . "# END YOAST REDIRECTS" . PHP_EOL;

			// Prepend our redirects to htaccess file
			$htaccess = $file_content . $htaccess;

			// Update the .htaccess file
			$wp_filesystem->put_contents(
				WPSEO_Redirect_File_Manager::get_htaccess_file_path(),
				$htaccess,
				FS_CHMOD_FILE // predefined mode settings for WP files
			);

		}

	}

}