<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the register post type tasks integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Register_Post_Type_Tasks_Integration_Test extends TestCase {

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Mock post type task.
	 *
	 * @var Mockery\MockInterface|Post_Type_Task_Interface
	 */
	protected $post_type_task_mock;

	/**
	 * Holds the instance.
	 *
	 * @var Register_Post_Type_Tasks_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper    = Mockery::mock( Post_Type_Helper::class );
		$this->post_type_task_mock = Mockery::mock( Post_Type_Task_Interface::class );

		// Default setup with no tasks.
		$this->instance = new Register_Post_Type_Tasks_Integration();
		$this->instance->set_post_type_helper( $this->post_type_helper );
	}

	/**
	 * Creates a mock post type task with specified behavior.
	 *
	 * @param string $id        The task ID.
	 * @param string $post_type The post type.
	 *
	 * @return Mockery\MockInterface|Post_Type_Task_Interface
	 */
	protected function create_mock_post_type_task( $id, $post_type = 'post' ) {
		$mock = Mockery::mock( Post_Type_Task_Interface::class );
		$mock->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $id );
		$mock->shouldReceive( 'get_post_type' )->zeroOrMoreTimes()->andReturn( $post_type );

		return $mock;
	}

	/**
	 * Creates a mock post type task that can be duplicated.
	 *
	 * @param string   $base_id    The base task ID.
	 * @param string[] $post_types The post types to create duplicates for.
	 *
	 * @return Mockery\MockInterface|Post_Type_Task_Interface
	 */
	protected function create_duplicatable_post_type_task( $base_id, $post_types = [ 'post', 'page' ] ) {
		$mock = Mockery::mock( Post_Type_Task_Interface::class );
		$mock->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $base_id );

		foreach ( $post_types as $post_type ) {
			$duplicate = $this->create_mock_post_type_task( $base_id . '-' . $post_type, $post_type );
			$mock->expects( 'duplicate_for_post_type' )
				->with( $post_type )
				->andReturn( $duplicate );
		}

		return $mock;
	}
}
