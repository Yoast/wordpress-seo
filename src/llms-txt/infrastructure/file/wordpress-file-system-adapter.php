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
	public function create_file( string $content ) {
		if ( ! \function_exists( 'get_filesystem_method' ) ) {
			require_once \ABSPATH . 'wp-admin/includes/file.php';
		}
		$access_type = \get_filesystem_method();
		if ( $access_type === 'direct' ) {
			$credentials = \request_filesystem_credentials( \site_url() . '/wp-admin/' );
			if ( \WP_Filesystem( $credentials ) ) {
				global $wp_filesystem;
				if ( ! $wp_filesystem->exists( \get_home_path() . 'llms.txt' ) ) {
					$wp_filesystem->put_contents(
						\get_home_path() . 'llms.txt',
						$content,
						\FS_CHMOD_FILE
					);
				}
			}
		}
	}

	/**
	 * Removes the llms.txt from the filesystem if direct access is available.
	 *
	 * @return void
	 */
	public function remove_file() {
		if ( ! \function_exists( 'get_filesystem_method' ) ) {
			require_once \ABSPATH . 'wp-admin/includes/file.php';
		}
		$access_type = \get_filesystem_method();
		if ( $access_type === 'direct' ) {
			$credentials = \request_filesystem_credentials( \site_url() . '/wp-admin/' );
			if ( \WP_Filesystem( $credentials ) ) {
				global $wp_filesystem;
				$wp_filesystem->delete( \get_home_path() . 'llms.txt' );
			}
		}
	}
}
