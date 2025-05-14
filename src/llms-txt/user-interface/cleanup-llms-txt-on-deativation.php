<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;

/**
 * Trys to clean up the llms.txt file when the plugin is deactivated.
 */
class Cleanup_Llms_Txt_On_Deactivation implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The command handler.
	 *
	 * @var Remove_File_Command_Handler
	 */
	private $command_handler;

	/**
	 * Constructor.
	 *
	 * @param Remove_File_Command_Handler $command_handler The command handler.
	 */
	public function __construct( Remove_File_Command_Handler $command_handler ) {
		$this->command_handler = $command_handler;
	}

	/**
	 * Registers the scheduling of the cron to the activation action.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_deactivate', [ $this, 'maybe_remove_llms_file' ] );
	}

	/**
	 * Call the command handler to remove the file.
	 *
	 * @return void
	 */
	public function maybe_remove_llms_file() {
		$this->command_handler->handle();
	}
}
