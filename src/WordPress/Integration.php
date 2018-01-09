<?php

namespace Yoast\YoastSEO\WordPress;

/**
 * An interface for registering integrations with WordPress
 */
interface Integration {
	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks();
}
