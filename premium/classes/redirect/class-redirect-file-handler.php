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
	 * @param WPSEO_Redirect_Manager[] $redirect_managers Array with the redirect managers for the url and the regex.
	 */
	public function save( $redirect_managers ) {
		if ( null !== $this->file ) {
			$this->file->save( $redirect_managers['url']->get_redirects(), $redirect_managers['regex']->get_redirects() );
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
