<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the WordPress_Global_State_Adapter tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_WordPress_Global_State_Adapter_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var WordPress_Global_State_Adapter
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WordPress_Global_State_Adapter();
	}
}
