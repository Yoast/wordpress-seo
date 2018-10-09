<?php
/**
 * Loads the integrations needed by the WordPress Admin.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use Yoast\YoastSEO\Watchers;

/**
 * Load Admin integrations.
 */
class Admin implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * @codeCoverageIgnore
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		$integration_group = new Integration_Group(
			array(
				new Watchers\Indexable_Post_Watcher(),
				new Watchers\Indexable_Term_Watcher(),
				new Watchers\Indexable_Author_Watcher(),
				new Watchers\Primary_Term_Watcher(),
			)
		);
		$integration_group->register_hooks();
	}
}
