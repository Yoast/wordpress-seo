<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_File
 */
abstract class WPSEO_Redirect_File {

	/**
	 * @var string
	 */
	protected $url_format = '';

	/**
	 * @var string
	 */
	protected $regex_format = '';

	/**
	 * @var string
	 */
	protected $current_type;

	/**
	 * Save the redirect file
	 *
	 * @param array $url_redirects   The URL redirects that will be saved.
	 * @param array $regex_redirects The regex redirect to save.
	 *
	 * @return bool
	 */
	public function save( array $url_redirects, array $regex_redirects ) {

		// Generate file content.
		$file_content = $this->generate_content( $url_redirects, $regex_redirects );

		// Check if the file content isset.
		if ( '' === $file_content ) {
			return false;
		}

		// Save the actual file.
		if ( is_writable( WPSEO_Redirect_File_Util::get_file_path() ) ) {
			WPSEO_Redirect_File_Util::write_file( WPSEO_Redirect_File_Util::get_file_path(), $file_content );
		}


		return true;
	}

	/**
	 * Generate file content
	 *
	 * @param array $url_redirects   The URL redirects that will be saved.
	 * @param array $regex_redirects The regex redirect to save.
	 *
	 * @return string
	 */
	protected function generate_content( array $url_redirects, array $regex_redirects ) {
		$file_content = '';

		// Formatting the url_redirects.
		$this->format_url_redirects( $file_content, $url_redirects );

		// Formatting the regex_redirects.
		$this->format_regex_redirects( $file_content, $regex_redirects );

		return $file_content;
	}

	/**
	 * Formatting the URL redirects
	 *
	 * @param string $file_content The content for the file to save.
	 * @param array  $redirects    Array with the redirects to save.
	 *
	 * @return bool
	 */
	protected function format_url_redirects( &$file_content, $redirects ) {
		$this->current_type = 'url';

		return $this->format_redirects( $file_content, $redirects, $this->url_format );
	}

	/**
	 * Formatting the regex redirects
	 *
	 * @param string $file_content The content for the file to save.
	 * @param array  $redirects    Array with the redirects to save.
	 *
	 * @return bool
	 */
	protected function format_regex_redirects( &$file_content, $redirects ) {
		$this->current_type = 'regex';

		return $this->format_redirects( $file_content, $redirects, $this->regex_format );
	}

	/**
	 * Format the redirects based on given params
	 *
	 * @param string $file_content    The content for the file to save.
	 * @param array  $redirects       Array with the redirects to save.
	 * @param string $redirect_format The format to put the redirect in.
	 *
	 * @return bool
	 */
	protected function format_redirects( &$file_content, array $redirects, $redirect_format ) {
		if ( count( $redirects ) === 0 ) {
			return false;
		}

		foreach ( $redirects as $target_to_redirect => $redirect ) {
			$file_content .= $this->format_redirect( $redirect_format, $target_to_redirect, $redirect ) . PHP_EOL;
		}

		return true;
	}

	/**
	 * Formatting the redirect by given redirect format. The right values will placed in the format by sprintf.
	 *
	 * @param string $redirect_format    The given format for the redirect to generate.
	 * @param string $target_to_redirect The URL/Regex that will be redirected.
	 * @param array  $redirect           The redirect data.
	 *
	 * @return string
	 */
	protected function format_redirect( $redirect_format, $target_to_redirect, array $redirect ) {
		return sprintf( $redirect_format, $target_to_redirect, $redirect['url'], $redirect['type'] );
	}

}
