<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Htaccess
 */
class WPSEO_Redirect_File_Handler {

	/**
	 * @var WPSEO_Redirect_File|null
	 */
	private $file;

	/**
	 * Setup the file object
	 *
	 * @param string $separate_file Saving the redirects in an separate apache file.
	 */
	public function __construct( $separate_file ) {
		$this->file = $this->get_file( $separate_file );
	}

	/**
	 * Saving the redirects to the file.
	 *
	 * @param WPSEO_Redirect[] $redirects Array with the redirects for the url and the regex.
	 */
	public function save( $redirects ) {
		if ( null !== $this->file ) {
			$this->file->export( $redirects );
		}
	}

	/**
	 * Getting the object which will save the redirects file
	 *
	 * @param string $separate_file Saving the redirects in an separate apache file.
	 *
	 * @return null|WPSEO_Redirect_File
	 */
	private function get_file( $separate_file ) {
		// Create the correct file object.
		if ( WPSEO_Utils::is_apache() ) {
			if ( 'on' === $separate_file ) {
				return new WPSEO_Redirect_File_Apache();
			}

			return new WPSEO_Redirect_File_Htaccess();
		}

		if ( WPSEO_Utils::is_nginx() ) {
			return new WPSEO_Redirect_File_Nginx();
		}

		return null;
	}

}
