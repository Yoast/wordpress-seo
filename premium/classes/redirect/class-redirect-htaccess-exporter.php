<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Htaccess_Redirect_File
 */
class WPSEO_Redirect_Htaccess_Exporter extends WPSEO_Redirect_Apache_Exporter {

	/**
	 * Save the redirect file
	 *
	 * @param string $file_content The file content that will be saved.
	 *
	 * @return bool
	 */
	protected function save( $file_content ) {
		$file_path = WPSEO_Redirect_Htaccess_Util::get_htaccess_file_path();

		// Update the .htaccess file.
		if ( is_writable( $file_path ) ) {
			$htaccess = $this->get_htaccess_content( $file_path, $file_content );
			$return   = (bool) WPSEO_Redirect_File_Util::write_file( $file_path, $htaccess );

			chmod( $file_path, FS_CHMOD_FILE );

			return $return;
		}

		return false;
	}

	/**
	 * Getting the content from current .htaccess
	 *
	 * @param string $file_path    The location of the htaccess file.
	 * @param string $file_content THe content to save in the htaccess file.
	 *
	 * @return string
	 */
	private function get_htaccess_content( $file_path, $file_content ) {
		// Read current htaccess.
		$htaccess = '';
		if ( file_exists( $file_path ) ) {
			$htaccess = file_get_contents( $file_path );
		}

		$htaccess = preg_replace( '`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS' . PHP_EOL . '`is', '', $htaccess );

		// New Redirects.
		$file_content = '# BEGIN YOAST REDIRECTS' . PHP_EOL . '<IfModule mod_rewrite.c>' . PHP_EOL . 'RewriteEngine On' . PHP_EOL . $file_content . '</IfModule>' . PHP_EOL . '# END YOAST REDIRECTS' . PHP_EOL;

		// Prepend our redirects to htaccess file.
		$htaccess = $file_content . $htaccess;

		return $htaccess;
	}
}
