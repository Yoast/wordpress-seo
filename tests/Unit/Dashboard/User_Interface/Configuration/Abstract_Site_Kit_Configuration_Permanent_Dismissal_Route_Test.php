<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Configuration_Dismissal_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Permanently_Dismissed_Site_Kit_Configuration_Repository tests.
 *
 * @group site_kit_configuration_permanent_dismissal
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Kit_Configuration_Permanent_Dismissal_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Configuration_Dismissal_Route
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

		$this->instance = new Site_Kit_Configuration_Dismissal_Route(
			new Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake(),
			$this->capability_helper
		);
	}
}
