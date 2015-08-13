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
	private $file_writer;

	/**
	 * Setup the file_write object
	 *
	 * @param string $separate_file
	 */
	public function __construct( $separate_file ) {
		$this->file_writer = $this->get_file_object( $separate_file );
	}

	/**
	 * Saving the redirects to the file.
	 *
	 * @param WPSEO_Redirect_Manager[] $redirect_managers
	 */
	public function save( $redirect_managers ) {
		// Save the file.
		if ( null !== $this->file_writer ) {
			$this->file_writer->save_file( $redirect_managers['url']->get_redirects(), $redirect_managers['regex']->get_redirects() );
		}
	}

	/**
	 * Getting the object which will save the redirects file
	 *
	 * @param string $separate_file
	 *
	 * @return null|WPSEO_Redirect_File
	 */
	private function get_file_object( $separate_file ) {
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
