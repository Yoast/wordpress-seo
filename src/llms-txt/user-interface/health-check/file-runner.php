<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Runner_Interface;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;

/**
 * Runs the File_Generation health check.
 */
class File_Runner implements Runner_Interface {

	/**
	 * Is set to non-empty string when the llms.txt file failed to (re-)generate.
	 *
	 * @var bool
	 */
	private $generation_failure_reason = '';

	/**
	 * The handler that populates the llms.txt file.
	 *
	 * @var Populate_File_Command_Handler
	 */
	private $populate_file_handler;

	/**
	 * Constructor.
	 *
	 * @param  Populate_File_Command_Handler $populate_file_handler The handler that populates the llms.txt file.
	 */
	public function __construct(
		Populate_File_Command_Handler $populate_file_handler
	) {
		$this->populate_file_handler = $populate_file_handler;
	}

	/**
	 * Runs the health check.
	 *
	 * @return void
	 */
	public function run() {
		$this->generation_failure_reason = \get_option( 'wpseo_llms_txt_file_failure', '' );
	}

	/**
	 * Returns true if there is no generation failure reason.
	 *
	 * @return bool The boolean indicating if the health check was succesful.
	 */
	public function is_successful() {
		return $this->generation_failure_reason === '';
	}

	/**
	 * Returns the generation failure reason.
	 *
	 * @return string The boolean indicating if the health check was succesful.
	 */
	public function get_generation_failure_reason(): string {
		return $this->generation_failure_reason;
	}
}
