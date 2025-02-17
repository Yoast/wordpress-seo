<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Configuration_Dismissal_Route;
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
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->instance = new Site_Kit_Configuration_Dismissal_Route(
			new Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake()
		);
	}
}
