<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Person_Config tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Person_Config_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Person_Config
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Person_Config();
	}
}
