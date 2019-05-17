<?php

namespace Yoast\WP\Free\Tests\Doubles;

/**
 * Class Shortlinker.
 *
 * @package Yoast\Tests\Doubles
 */
class Shortlinker extends \WPSEO_Shortlinker {

	/**
	 * Gets the additional shortlink data.
	 *
	 * @return array The shortlink data
	 */
	public function get_additional_shortlink_data() {
		return $this->collect_additional_shortlink_data();
	}
}
