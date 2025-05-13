<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Domain\File;

/**
 * Interface to describe handeling the llms.txt file.
 */
interface Llms_File_System_Interface {

	/**
	 * Method to set the llms.txt file content.
	 *
	 * @param string $content The content for the file.
	 *
	 * @return void
	 */
	public function set_file_content( string $content );

	/**
	 * Method to remove the llms.txt file from the file system.
	 *
	 * @return void
	 */
	public function remove_file();

	/**
	 * Gets the contents of the current llms.txt file.
	 *
	 * @return string
	 */
	public function get_file_contents(): string;
}
