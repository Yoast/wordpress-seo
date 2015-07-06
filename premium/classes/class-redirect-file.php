<?php
/**
 * @package WPSEO\Premium
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Interface iWPSEO_Redirect_File
 */
interface IWPSEO_Redirect_File {
	/**
	 * Formatting the URL redirect
	 *
	 * @param string $old_url
	 * @param string $new_url
	 * @param int    $type
	 *
	 * @return mixed
	 */
	public function format_url_redirect( $old_url, $new_url, $type );

	/**
	 * Formating the regex redirect
	 *
	 * @param string $old_url
	 * @param string $new_url
	 * @param int    $type
	 *
	 * @return mixed
	 */
	public function format_regex_redirect( $old_url, $new_url, $type );
}

/**
 * Class WPSEO_Redirect_File
 */
abstract class WPSEO_Redirect_File implements IWPSEO_Redirect_File {

	/**
	 * Generate file content
	 *
	 * @return string
	 */
	protected function generate_file_content() {
		$file_content = '';

		// Generate URL redirects.
		$url_redirect_manager = new WPSEO_URL_Redirect_Manager();
		$url_redirects        = $url_redirect_manager->get_redirects();
		if ( count( $url_redirects ) > 0 ) {
			foreach ( $url_redirects as $old_url => $redirect ) {
				$file_content .= $this->format_url_redirect( $old_url, $redirect['url'], $redirect['type'] ) . "\n";
			}
		}

		// Generate REGEX redirects.
		$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
		$regex_redirects        = $regex_redirect_manager->get_redirects();
		if ( count( $regex_redirects ) > 0 ) {
			foreach ( $regex_redirects as $regex => $redirect ) {
				$file_content .= $this->format_regex_redirect( $regex, $redirect['url'], $redirect['type'] ) . "\n";
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

		// Generate file content.
		$file_content = $this->generate_file_content();

		// Check if the file content isset.
		if ( null == $file_content ) {
			return false;
		}

		// Save the actual file.
		@file_put_contents( WPSEO_Redirect_File_Manager::get_file_path(), $file_content );
	}

}
