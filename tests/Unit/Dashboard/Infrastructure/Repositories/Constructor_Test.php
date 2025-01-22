<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Test class for the constructor.
 *
 * @group Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Permanently_Dismissed_Site_Kit_Widget_Repository_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
