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
				$this->get_llms_file_path(),
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
			$wp_filesystem->delete( $this->get_llms_file_path() );
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

			return $wp_filesystem->get_contents( $this->get_llms_file_path() );
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

			return $wp_filesystem->exists( $this->get_llms_file_path() );
		}

		return false;
	}

	/**
	 * Checks if the file system is available.
	 *
	 * @return bool If the file system is available.
	 */
	public function is_file_system_available(): bool {
		if ( ! \function_exists( 'WP_Filesystem' ) ) {
			require_once \ABSPATH . 'wp-admin/includes/file.php';
		}

		return \WP_Filesystem();
	}

	/**
	 * Creates the path to the llms.txt file.
	 *
	 * @return string
	 */
	private function get_llms_file_path(): string {
		return \trailingslashit( \get_home_path() ) . 'llms.txt';
	}
}
