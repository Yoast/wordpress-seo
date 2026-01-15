<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Mockery;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tracking\Infrastructure\Tracking_Link_Adapter;

/**
 * Base class for the tasks collector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Tasks_Collector_Test extends TestCase {

	/**
	 * Mock regular task.
	 *
	 * @var Mockery\MockInterface|Task_Interface
	 */
	protected $task_mock;

	/**
	 * Mock completeable task.
	 *
	 * @var Mockery\MockInterface|Completeable_Task_Interface
	 */
	protected $completeable_task_mock;

	/**
	 * Mock post type task.
	 *
	 * @var Mockery\MockInterface|Post_Type_Task_Interface
	 */
	protected $post_type_task_mock;

	/**
	 * Mock tracking link adapter.
	 *
	 * @var Mockery\MockInterface|Tracking_Link_Adapter
	 */
	protected $tracking_link_adapter;

	/**
	 * Holds the instance.
	 *
	 * @var Tasks_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->task_mock              = Mockery::mock( Task_Interface::class );
		$this->completeable_task_mock = Mockery::mock( Completeable_Task_Interface::class );
		$this->post_type_task_mock    = Mockery::mock( Post_Type_Task_Interface::class );
		$this->tracking_link_adapter  = Mockery::mock( Tracking_Link_Adapter::class );

		$this->instance = new Tasks_Collector();
		$this->instance->set_tracking_link_adapter( $this->tracking_link_adapter );
	}

	/**
	 * Creates a mock task with specific ID and data.
	 *
	 * @param string             $id             The task ID.
	 * @param array<string,bool> $to_array       The array representation.
	 * @param string             $task_interface The interface to mock.
	 * @param bool               $is_valid       Whether the task is valid.
	 *
	 * @return Mockery\MockInterface
	 */
	protected function create_mock_task( $id, $to_array = [], $task_interface = Task_Interface::class, $is_valid = true ) {
		$mock     = Mockery::mock( $task_interface );
		$cta_mock = $this->create_mock_cta();
		$mock->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $id );
		$mock->shouldReceive( 'is_valid' )->zeroOrMoreTimes()->andReturn( $is_valid );
		$mock->shouldReceive( 'get_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );
		$mock->shouldReceive( 'set_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );

		if ( ! empty( $to_array ) ) {
			$mock->expects( 'to_array' )->andReturn( $to_array );
		}

		return $mock;
	}

	/**
	 * Creates a mock call to action entry.
	 *
	 * @return Mockery\MockInterface
	 */
	protected function create_mock_cta() {
		$cta_mock = Mockery::mock( Call_To_Action_Entry::class );

		$cta_mock->shouldReceive( 'get_label' )->zeroOrMoreTimes()->andReturn( 'label' );
		$cta_mock->shouldReceive( 'get_type' )->zeroOrMoreTimes()->andReturn( 'link' );
		$cta_mock->shouldReceive( 'get_href' )->zeroOrMoreTimes()->andReturn( 'href' );

		return $cta_mock;
	}
}
