<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\File\Commands;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;

/**
 * Handles the population of the llms.txt.
 */
class Populate_File_Command_Handler {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The file system adapter.
	 *
	 * @var WordPress_File_System_Adapter
	 */
	private $file_system_adapter;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper                $options_helper      The options helper.
	 * @param WordPress_File_System_Adapter $file_system_adapter The file system adapter.
	 */
	public function __construct( Options_Helper $options_helper, WordPress_File_System_Adapter $file_system_adapter ) {
		$this->options_helper      = $options_helper;
		$this->file_system_adapter = $file_system_adapter;
	}

	/**
	 * Runs the command.
	 *
	 * @return bool Whether the file was created successfully.
	 */
	public function handle() {

		$content = '';
		$this->file_system_adapter->create_file( $content );
		// Maybe move this to a class if we need to handle this option more often.
		$this->options_helper->set( 'llms_txt_content_hash', \md5( $content ) );

		return false;
	}
}
