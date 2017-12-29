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
				new Watchers\Indexable_Post(),
				new Watchers\Indexable_Term(),
				new Watchers\Indexable_Author(),
				new Watchers\Primary_Term(),
			)
		);
		$integration_group->register_hooks();
	}
}
