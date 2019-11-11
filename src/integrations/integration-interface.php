<?php
/**
 * Integration interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\Free\Integrations;

use Yoast\WP\Free\Loadable_Interface;

/**
 * An interface for registering integrations with WordPress
 */
interface Integration_Interface extends Loadable_Interface {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks();
}
