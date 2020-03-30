<?php
/**
 * Integration interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\SEO;

/**
 * An interface for registering integrations with WordPress
 */
interface Loadable_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals();
}

class_alias( '\Yoast\WP\SEO\Loadable_Interface', '\Yoast\WP\SEO\WordPress\Loadable' );
