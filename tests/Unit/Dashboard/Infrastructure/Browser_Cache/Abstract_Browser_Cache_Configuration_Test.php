<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Browser_Cache;

use Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the browser cache configuration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Browser_Cache_Configuration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Browser_Cache_Configuration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Browser_Cache_Configuration();
	}
}
