<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Complete_Task;

use Mockery;
use WP_REST_Request;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the complete task route tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Complete_Task_Route_Test extends TestCase {

	/**
	 * The tasks collector.
	 *
	 * @var Mockery\MockInterface|Tasks_Collector
	 */
	protected $tasks_collector;

	/**
	 * The capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Complete_Task_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->tasks_collector   = Mockery::mock( Tasks_Collector::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );

		$this->instance = new Complete_Task_Route(
			$this->tasks_collector,
			$this->capability_helper
		);
	}

	/**
	 * Creates a mock WP_REST_Request.
	 *
	 * @param array<string,string> $params The parameters to return.
	 *
	 * @return Mockery\MockInterface|WP_REST_Request
	 */
	protected function create_mock_request( $params = [] ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )
			->with( 'options' )
			->andReturn( $params );

		return $request;
	}

	/**
	 * Creates a mock completeable task.
	 *
	 * @param string $id The task ID.
	 *
	 * @return Mockery\MockInterface|Completeable_Task_Interface
	 */
	protected function create_mock_completeable_task( $id ) {
		$task = Mockery::mock( Completeable_Task_Interface::class );
		$task->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $id );

		return $task;
	}
}
