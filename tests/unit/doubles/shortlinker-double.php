<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use WPSEO_Shortlinker;

/**
 * Class Shortlinker_Double.
 */
class Shortlinker_Double extends WPSEO_Shortlinker {

	/**
	 * Gets the additional shortlink data.
	 *
	 * @return array The shortlink data
	 */
	public function get_additional_shortlink_data() {
		return $this->collect_additional_shortlink_data();
	}
}
