<?php
/**
 * WP CLI command interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\SEO\Commands;

/**
 * An interface for registering integrations with WordPress
 */
interface Command_Interface {

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
