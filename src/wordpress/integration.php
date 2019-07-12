<?php
/**
 * Integration interface definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\Free\WordPress;

/**
 * An interface for registering integrations with WordPress
 */
interface Integration extends Loadable {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks();
}
