<?php
/**
 * Integration interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\Free\Initializers;

use Yoast\WP\Free\Loadable_Interface;

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
