<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use Yoast\YoastSEO\Watchers;

class Admin implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function register_hooks() {
		$integration_group = new Integration_Group(
			array(
				new Watchers\Post(),
				new Watchers\Term(),
				new Watchers\Author(),
			)
		);
		$integration_group->register_hooks();
	}
}
