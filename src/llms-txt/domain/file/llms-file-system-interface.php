<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Domain\File;

/**
 * Interface to describe handeling the llms.txt file.
 */
interface Llms_File_System_Interface {

	/**
	 * Method to create the llms.txt file on the actual file system.
	 *
	 * @param string $content The content for the file.
	 *
	 * @return void
	 */
	public function create_file( string $content );

	/**
	 * Method to remove the llms.txt file from the file system.
	 *
	 * @return void
	 */
	public function remove_file();
}
