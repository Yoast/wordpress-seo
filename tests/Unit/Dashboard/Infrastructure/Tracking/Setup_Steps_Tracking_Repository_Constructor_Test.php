<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Test class for the constructor.
 *
 * @group Site_Kit_Usage_Tracking_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Site_Kit_Usage_Tracking_Repository::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class SetupSteps_Tracking_Repository_Constructor_Test extends Abstract_Setup_Steps_Tracking_Repository_Test {

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
