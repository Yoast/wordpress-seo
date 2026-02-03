<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Infrastructure\Default_SEO_Data;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Test class for the constructor.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Constructor_Test extends Abstract_Default_SEO_Data_Collector_Test {

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
