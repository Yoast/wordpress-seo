<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure\Tracking_On_Page_Load;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;

/**
 * Tests the Tracking_On_Page_Load_Integration constructor.
 *
 * @group tracking
 *
 * @covers Yoast\WP\SEO\Tracking\Infrastructure\Tracking_On_Page_Load_Integration::__construct
 */
final class Constructor_Test extends Abstract_Tracking_On_Page_Load_Integration_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Action_Tracker::class,
			$this->getPropertyValue( $this->instance, 'action_tracker' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
