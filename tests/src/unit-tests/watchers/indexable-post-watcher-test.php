<?php

namespace Yoast\Tests\UnitTests\Watchers;

use Yoast\WP\Free\Config\Database_Migration;
use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Watchers\Indexable_Post_Watcher;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * Sets up the environment for each test.
	 */
	public function setUp() {
		parent::setUp();

		\delete_transient( Database_Migration::MIGRATION_ERROR_TRANSIENT_KEY );
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::register_hooks()
	 */
	public function test_register_hooks() {
		$instance = new Indexable_Post_Watcher();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', array( $instance, 'save_meta' ) ) );
		$this->assertNotFalse( \has_action( 'delete_post', array( $instance, 'delete_meta' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::delete_meta()
	 */
	public function test_delete_meta() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'delete', 'delete_meta' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete_meta' );

		$id = 1;

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->with( $id, false )
			->will( $this->returnValue( $indexable_mock ) );

		$instance->delete_meta( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::delete_meta()
	 */
	public function test_delete_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->delete_meta( 1 );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::save_meta()
	 */
	public function test_save_meta() {
		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$post_id = 1;

		$formatter_mock = $this
			->getMockBuilder( '\Yoast\WP\Free\Formatters\Indexable_Post_Formatter' )
			->setConstructorArgs( array( $post_id ) )
			->setMethods( array( 'format' ) )
			->getMock();

		$formatter_mock
			->expects( $this->once() )
			->method( 'format' )
			->with( $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setMethods(
				array(
					'is_post_indexable',
					'get_indexable',
					'get_formatter',
				)
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_post_indexable' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->returnValue( $indexable_mock ) );

		$instance
			->expects( $this->once() )
			->method( 'get_formatter' )
			->will( $this->returnValue( $formatter_mock ) );


		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->save_meta( $post_id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::save_meta()
	 */
	public function test_save_meta_is_post_not_indexable() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setMethods( array( 'is_post_indexable', 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_post_indexable' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->never() )
			->method( 'get_indexable' );

		$instance->save_meta( 1 );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::save_meta()
	 */
	public function test_save_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->save_meta( -1 );
	}
}
