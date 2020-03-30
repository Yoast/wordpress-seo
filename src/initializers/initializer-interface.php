<?php
/**
 * Integration interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Loadable_Interface;

/**
 * An interface for registering integrations with WordPress
 */
interface Initializer_Interface extends Loadable_Interface {

	/**
	 * Runs this initializer.
	 *
	 * @return void
	 */
	public function initialize();
}

class_alias( '\Yoast\WP\SEO\Initializers\Initializer_Interface', '\Yoast\WP\SEO\WordPress\Initializer' );
