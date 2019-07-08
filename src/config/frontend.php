<?php
/**
 * Loads the integrations that are needed on the Frontend.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Config;

use Yoast\WP\Free\WordPress\Integration;

/**
 * Load Frontend integrations.
 */
class Frontend implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
	}
}
