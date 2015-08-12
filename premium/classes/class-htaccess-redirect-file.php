<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Htaccess_Redirect_File
 */
class WPSEO_Htaccess_Redirect_File extends WPSEO_Apache_Redirect_File {

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

		if ( null === $file_content ) {
			return false;
		}

		return $this->write_htaccess_content( $file_content );
	}

	/**
	 * Writing the redirects to the .htaccess file.
	 *
	 * @param string $file_content
	 *
	 * @return bool
	 */
	private function write_htaccess_content( $file_content ) {
		$file_path = WPSEO_Redirect_Htaccess::get_htaccess_file_path();

		// Update the .htaccess file.
		if ( is_writable( $file_path ) ) {
			$htaccess = $this->get_htaccess_content( $file_path, $file_content );
			$return   = (bool) file_put_contents( $file_path, $htaccess );

			chmod( $file_path, FS_CHMOD_FILE );

			return $return;
		}

		return false;
	}

	/**
	 * Getting the content from current .htacesss
	 *
	 * @param string $file_path
	 * @param string $file_content
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
