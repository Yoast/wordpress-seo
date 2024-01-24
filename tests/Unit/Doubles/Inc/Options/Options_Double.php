<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options;

use WPSEO_Options;

/**
 * Test Helper Class.
 */
final class Options_Double extends WPSEO_Options {

	public static $option_values = null;

	/**
	 * Options_Double constructor.
	 */
	public function __construct() {
		parent::__construct();
	}
}
