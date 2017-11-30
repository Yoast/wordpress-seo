<?php

namespace Yoast\YoastSEO\Indexable;

use Yoast\WordPress\Integration;
use Yoast\WordPress\Integration_Group;

class Bootstrap extends Integration_Group {

	/**
	 * @return Integration[] List of registered services.
	 */
	protected function get_integrations() {
		return array(
			new Watchers\Post(),
			new Watchers\Term(),
			new Watchers\Author()
		);
	}
}
