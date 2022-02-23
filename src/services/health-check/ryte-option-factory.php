<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Ryte_Option;

/**
 * Creates WPSEO_Ryte_Option instances.
 */
class Ryte_Option_Factory {

	/**
	 * Returns a new WPSEO_Ryte_Option instance.
	 *
	 * @return WPSEO_Ryte_Option
	 */
	public function create() {
		return new WPSEO_Ryte_Option();
	}
}
