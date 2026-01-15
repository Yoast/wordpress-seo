<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks_Repository;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the tasks repository tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Tasks_Repository_Test extends TestCase {

	/**
	 * The tasks collector.
	 *
	 * @var Mockery\MockInterface|Cached_Tasks_Collector
	 */
	protected $tasks_collector;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Tasks_Repository
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->tasks_collector = Mockery::mock( Cached_Tasks_Collector::class );
		$this->options_helper  = Mockery::mock( Options_Helper::class );

		$this->instance = new Tasks_Repository( $this->tasks_collector, $this->options_helper );
	}
}
