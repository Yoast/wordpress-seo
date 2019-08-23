<?php
/**
 * WP CLI command interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\Free\WordPress;

/**
 * An interface for registering integrations with WordPress
 */
interface WP_CLI_Command {

	/**
	 * Returns the name of this command.
	 *
	 * @return string
	 */
	public function get_name();

	/**
	 * Returns the configuration of this command.
	 *
	 * @return array
	 */
	public function get_config();

	/**
	 * Executes this command.
	 *
	 * @return void
	 */
	public function execute();
}
