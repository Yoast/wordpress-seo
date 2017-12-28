<?php

namespace Yoast\YoastSEO\Database;

use Yoast\WordPress\Integration;
use Yoast\WordPress\Integration_Group;

class Bootstrap implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function add_hooks() {
		$integration_group = new Integration_Group(
			array(
				new Config\Database(),
				new Services\Migration(),
			)
		);
		$integration_group->add_hooks();
	}
}
