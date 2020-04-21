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
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace();
}
