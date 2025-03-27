<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Tracking;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the setup steps tracking tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Setup_Steps_Tracking_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Setup_Steps_Tracking
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

		$this->instance = new Setup_Steps_Tracking(
			new Setup_Steps_Tracking_Repository_Fake(),
		);
	}
}
