<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors\Cached_Collector;

use Mockery;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the cached tasks collector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Cached_Tasks_Collector_Test extends TestCase {

	/**
	 * The tasks collector.
	 *
	 * @var Mockery\MockInterface|Tasks_Collector
	 */
	protected $tasks_collector;

	/**
	 * Holds the instance.
	 *
	 * @var Cached_Tasks_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->tasks_collector = Mockery::mock( Tasks_Collector::class );

		$this->instance = new Cached_Tasks_Collector( $this->tasks_collector );
	}
}
