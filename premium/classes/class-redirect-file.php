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
	protected $url_redirect_format = '';

	/**
	 * @var string
	 */
	protected $regex_redirect_format = '';

	/**
	 * @var string
	 */
	protected $current_redirect_type;

	/**
	 * Save the redirect file
	 *
	 * @param array $url_redirects
	 * @param array $regex_redirects
	 *
	 * @return bool
	 */
	public function save_file( array $url_redirects, array $regex_redirects ) {

		// Generate file content.
		$file_content = $this->generate_file_content( $url_redirects, $regex_redirects );

		// Check if the file content isset.
		if ( '' === $file_content ) {
			return false;
		}

		// Save the actual file.
		if ( is_writable( WPSEO_Redirect_File_Util::get_file_path() ) ) {
			try {
				file_put_contents( WPSEO_Redirect_File_Util::get_file_path(), $file_content );
			}
			catch ( Exception $e ) {
				// Do nothing.
			}
		}


		return true;
	}

	/**
	 * Generate file content
	 *
	 * @param array $url_redirects
	 * @param array $regex_redirects
	 *
	 * @return string
	 */
	protected function generate_file_content( array $url_redirects, array $regex_redirects ) {
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
	 * @param string $file_content
	 * @param array  $redirects
	 *
	 * @return bool
	 */
	protected function format_url_redirects( &$file_content, $redirects ) {
		$this->current_redirect_type = 'url';

		return $this->format_redirects( $file_content, $redirects, $this->url_redirect_format );
	}

	/**
	 * Formatting the regex redirects
	 *
	 * @param string $file_content
	 * @param array  $redirects
	 *
	 * @return bool
	 */
	protected function format_regex_redirects( &$file_content, $redirects ) {
		$this->current_redirect_type = 'regex';

		return $this->format_redirects( $file_content, $redirects, $this->regex_redirect_format );
	}

	/**
	 * @param string $file_content
	 * @param array  $redirects
	 * @param string $redirect_format
	 *
	 * @return bool
	 */
	protected function format_redirects( &$file_content, array $redirects, $redirect_format ) {
		if ( count( $redirects ) === 0 ) {
			return false;
		}

		foreach ( $redirects as $redirect_key => $redirect ) {
			$file_content .= $this->format_redirect( $redirect_format, $redirect_key, $redirect ) . PHP_EOL;
		}

		return true;
	}

	/**
	 * @param string $redirect_format
	 * @param string $redirect_key
	 * @param array  $redirect
	 *
	 * @return string
	 */
	protected function format_redirect( $redirect_format, $redirect_key, array $redirect ) {
		return sprintf( $redirect_format, $redirect_key, $redirect['url'], $redirect['type'] );
	}

}
