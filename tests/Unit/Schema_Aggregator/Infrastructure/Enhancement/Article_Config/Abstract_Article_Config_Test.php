<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Article_Config tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Article_Config_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Article_Config
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Article_Config();
	}
}
