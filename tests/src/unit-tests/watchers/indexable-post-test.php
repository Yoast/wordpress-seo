<?php

namespace Yoast\Tests\UnitTests\Watchers;

use Yoast\Tests\Doubles\Indexable_Post_Watcher as Indexable_Post_Double;
use Yoast\YoastSEO\Config\Database_Migration;
use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Watchers\Indexable_Post;

/**
 * Class Indexable_Post_Test
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Test extends \PHPUnit_Framework_TestCase {
	public function setUp() {
		parent::setUp();

		\delete_transient( Database_Migration::MIGRATION_ERROR_TRANSIENT_KEY );
	}

	/**
	 * Tests if the expected hooks are registered
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::register_hooks()
	 */
	public function test_register_hooks() {
		$instance = new Indexable_Post();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', array( $instance, 'save_meta' ) ) );
		$this->assertNotFalse( \has_action( 'delete_post', array( $instance, 'delete_meta' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::delete_meta()
	 */
	public function test_delete_meta() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\YoastSEO\Yoast_Model' )
			->setMethods( array( 'delete' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$id = 1;

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->with( $id, false )
			->will( $this->returnValue( $indexable_mock ) );

		$instance->delete_meta( $id );
	}

	/**
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::delete_meta()
	 */
	public function test_delete_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new \Yoast\YoastSEO\Exceptions\No_Indexable_Found() ) );

		$instance->delete_meta( 1 );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_indexable()
	 *
	 * @expectedException \Yoast\YoastSEO\Exceptions\No_Indexable_Found
	 */
	public function test_get_indexable_exception() {
		$instance = new Indexable_Post_Double();

		$instance->get_indexable( 1, false );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_indexable()
	 */
	public function test_get_indexable_create() {
		$instance = new Indexable_Post_Double();

		$this->assertInstanceOf( '\Yoast\YoastSEO\Yoast_Model', $instance->get_indexable( 1, true ) );
	}

	/**
	 * Tests the save meta functionality
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::save_meta()
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
			->getMockBuilder( '\Yoast\YoastSEO\Formatters\Indexable_Post' )
			->setConstructorArgs( array( $post_id ) )
			->setMethods( array( 'format' ) )
			->getMock();

		$formatter_mock
			->expects($this->once() )
			->method( 'format' )
			->with( $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
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
	 * Tests the early return for non-indexable post
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::save_meta()
	 */
	public function test_save_meta_is_post_not_indexable() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
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
	 * Tests the save meta functionality
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::save_meta()
	 */
	public function test_save_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->save_meta( -1 );
	}
}
