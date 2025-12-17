<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;

use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Site_Schema_Robots_Txt_Integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Schema_Robots_Txt_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Robots_Txt_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Site_Schema_Robots_Txt_Integration();
	}
}
