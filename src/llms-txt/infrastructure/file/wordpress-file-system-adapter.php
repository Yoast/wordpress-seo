<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\File;

use Yoast\WP\SEO\Llms_Txt\Domain\File\Llms_File_System_Interface;

/**
 * Adapter class for handling file system operations in a WordPress environment.
 */
class WordPress_File_System_Adapter implements Llms_File_System_Interface {

	/**
	 * Creates a file and writes the specified content to it.
	 *
	 * @param string $content The content to write into the file.
	 *
	 * @return void
	 */
	public function set_file_content( string $content ) {
		if ( $this->is_file_system_available() ) {
			global $wp_filesystem;
			$wp_filesystem->put_contents(
				\get_home_path() . 'llms.txt',
				$content,
				\FS_CHMOD_FILE
			);

		}
	}

	/**
	 * Removes the llms.txt from the filesystem if direct access is available.
	 *
	 * @return void
	 */
	public function remove_file() {
		if ( $this->is_file_system_available() ) {
			global $wp_filesystem;
			$wp_filesystem->delete( \get_home_path() . 'llms.txt' );
		}
	}

	/**
	 * Gets the contents of the current llms.txt file.
	 *
	 * @return string The content of the file.
	 */
	public function get_file_contents(): string {
		if ( $this->is_file_system_available() ) {
			global $wp_filesystem;

			return $wp_filesystem->get_contents( \get_home_path() . 'llms.txt' );
		}

		return '';
	}

	/**
	 * Gets the contents of the current llms.txt file.
	 *
	 * @return string The content of the file.
	 */
	public function file_exists(): string {
		if ( $this->is_file_system_available() ) {
			global $wp_filesystem;

			return $wp_filesystem->exists( \get_home_path() . 'llms.txt' );
		}

		return false;
	}

	/**
	 * Gets the current file system method.
	 *
	 * @return string The current file system method.
	 */
	public function get_filesystem_method() {
		if ( ! \function_exists( 'get_filesystem_method' ) ) {
			require_once \ABSPATH . 'wp-admin/includes/file.php';
		}

		return \get_filesystem_method();
	}

	/**
	 * Checks if the file system is available.
	 *
	 * @return bool If the file system is available.
	 */
	private function is_file_system_available(): bool {
		if ( $this->get_filesystem_method() === 'direct' ) {
			$credentials = \request_filesystem_credentials( \site_url() . '/wp-admin/' );

			return \WP_Filesystem( $credentials );
		}

		return false;
	}
}
