<?php

namespace Yoast\YoastSEO\Indexable;

use Yoast\WordPress\Integration;

class Bootstrap implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function add_hooks() {
		$integration_group = new Integration_Group(
			array(
				new Watchers\Post(),
				new Watchers\Term(),
				new Watchers\Author(),
			)
		);
		$integration_group->initialize();
	}
}
