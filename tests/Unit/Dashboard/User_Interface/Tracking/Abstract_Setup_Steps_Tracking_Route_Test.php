<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Setup_Steps_Tracking_Route tests.
 *
 * @group site_kit_usage_tracking_route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Setup_Steps_Tracking_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Setup_Steps_Tracking_Route
	 */
	protected $instance;

	/**
	 * Holds the mock for the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );

		$this->instance = new Setup_Steps_Tracking_Route(
			new Setup_Steps_Tracking_Repository_Fake(),
			$this->capability_helper
		);
	}
}
