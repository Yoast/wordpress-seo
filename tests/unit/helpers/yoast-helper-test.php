<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Yoast_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Yoast_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Yoast_Helper
 */
class Yoast_Helper_Test extends TestCase {

	/**
	 * Tests whether the plugin is network-active or not.
	 *
	 * @covers ::is_plugin_network_active
	 */
	public function test_is_plugin_network_active() {
		$yoast_helper = new Yoast_Helper();

		static::assertFalse( $yoast_helper->is_plugin_network_active() );
	}
}
