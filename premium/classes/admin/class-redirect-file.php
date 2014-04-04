<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

interface iWPSEO_Redirect_File {
	public function format_redirect( $old_url, $new_url );
}

abstract class WPSEO_Redirect_File implements iWPSEO_Redirect_File {

	/**
	 * Generate file content
	 *
	 * @return string
	 */
	private function generate_file_content() {
		$file_content = "";

		$url_redirect_manager = new WPSEO_URL_Redirect_Manager();

		$url_redirects    = $url_redirect_manager->get_redirects();
		if ( count( $url_redirects ) > 0 ) {
			foreach ( $url_redirects as $old_url => $new_url ) {
				$file_content .= $this->format_redirect( $old_url, $new_url ) . "\n";
			}
		}
		return $file_content;
	}

	/**
	 * Save the redirect file
	 *
	 * @return bool
	 */
	public function save_file() {

		// Generate file content
		$file_content = $this->generate_file_content();

		// Check if the file content isset
		if ( null == $file_content ) {
			return false;
		}

		// Save the actual file
		@file_put_contents( WPSEO_Redirect_File_Manager::get_file_path(), $file_content );
	}

}