<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Creates Report_Builder instances.
 */
class Report_Builder_Factory {

	/**
	 * Creates a new Report_Builder instance.
	 *
	 * @return Report_Builder The new Report_Builder instance.
	 */
	public function create() {
		return new Report_Builder();
	}
}
