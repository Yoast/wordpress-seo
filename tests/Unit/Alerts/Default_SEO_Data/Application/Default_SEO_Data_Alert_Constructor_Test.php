<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Default_SEO_Data\Application;

use Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector;
use Yoast_Notification_Center;

/**
 * Test class for the constructor.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Constructor_Test extends Abstract_Default_SEO_Data_Alert_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' )
		);
		$this->assertInstanceOf(
			Default_SEO_Data_Collector::class,
			$this->getPropertyValue( $this->instance, 'default_seo_data_collector' )
		);
	}
}
