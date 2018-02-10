<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_File.
 */
abstract class WPSEO_Redirect_File_Exporter implements WPSEO_Redirect_Exporter {

	/**
	 * @var string
	 */
	protected $url_format = '';

	/**
	 * @var string
	 */
	protected $regex_format = '';

	/**
	 * Exports an array of redirects.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to export.
	 *
	 * @return bool
	 */
	public function export( $redirects ) {

		$file_content = '';
		if ( ! empty( $redirects ) ) {
			foreach ( $redirects as $redirect ) {
				$file_content .= $this->format( $redirect ) . PHP_EOL;
			}
		}
		// Check if the file content isset.
		return $this->save( $file_content );
	}

	/**
	 * Formats a redirect for use in the export.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to format.
	 *
	 * @return string
	 */
	public function format( WPSEO_Redirect $redirect ) {
		return sprintf(
			$this->get_format( $redirect->get_format() ),
			$redirect->get_origin(),
			$redirect->get_target(),
			$redirect->get_type()
		);
	}

	/**
	 * Returns the needed format for the redirect.
	 *
	 * @param string $redirect_format The format of the redirect.
	 *
	 * @return string
	 */
	protected function get_format( $redirect_format ) {
		if ( $redirect_format === WPSEO_Redirect::FORMAT_PLAIN ) {
			return $this->url_format;
		}

		return $this->regex_format;
	}

	/**
	 * Save the redirect file.
	 *
	 * @param string $file_content The file content that will be saved.
	 *
	 * @return bool
	 */
	protected function save( $file_content ) {
		// Save the actual file.
		if ( is_writable( WPSEO_Redirect_File_Util::get_file_path() ) ) {
			WPSEO_Redirect_File_Util::write_file( WPSEO_Redirect_File_Util::get_file_path(), $file_content );
		}

		return true;
	}
}
