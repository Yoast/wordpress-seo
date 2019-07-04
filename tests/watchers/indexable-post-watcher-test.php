<?php

namespace Yoast\WP\Free\Tests\Watchers;

use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Helpers\Indexable_Helper;
use Yoast\WP\Free\Watchers\Indexable_Post_Watcher;
use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::register_hooks
	 */
	public function test_register_hooks() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							->disableOriginalConstructor()
							->getMock();

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', array( $instance, 'build_indexable' ) ) );
		$this->assertNotFalse( \has_action( 'delete_post', array( $instance, 'delete_indexable' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::delete_indexable
	 */
	public function test_delete_indexable() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							 ->disableOriginalConstructor()
							 ->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'delete' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$id = 1;

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'post', false )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							 ->disableOriginalConstructor()
							 ->getMock();

		$id = 1;

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'post', false )
					->willReturn( false );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::build_indexable
	 */
	public function test_build_indexable() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							 ->disableOriginalConstructor()
			 				 ->setMethods( [ 'build' ] )
							 ->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$id = 1;

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'post', false )
					->willReturn( $indexable_mock );

		$builder_mock->expects( $this->once() )
					 ->method( 'build' )
					 ->with( $id, $indexable_mock )
					 ->willReturn( $indexable_mock );

		$instance = $instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setConstructorArgs( [ $helper_mock, $builder_mock ] )
			->setMethods( [ 'is_post_indexable' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_post_indexable' )
			->will( $this->returnValue( true ) );


		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::build_indexable
	 */
	public function test_build_indexable_is_post_not_indexable() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							 ->disableOriginalConstructor()
							 ->getMock();

		$helper_mock->expects( $this->never() )->method( 'find_by_id_and_type' );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Post_Watcher' )
			->setConstructorArgs( [ $helper_mock, $builder_mock ] )
			->setMethods( array( 'is_post_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_post_indexable' )
			->will( $this->returnValue( false ) );

		$instance->build_indexable( 1 );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Post_Watcher::build_indexable
	 */
	public function test_build_indexable_does_not_exist() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )
			->once()
			->with( $id )
			->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )
			->once()
			->with( $id )
			->andReturn( false );

		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [
								'find_by_id_and_type',
								'create_for_id_and_type',
							] )
							->getMock();
		$builder_mock = $this->getMockBuilder( Indexable_Post_Builder::class )
							 ->disableOriginalConstructor()
							 ->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
			        ->with( $id, 'post', false )
					->willReturn( false );

		$helper_mock->expects( $this->once() )
					->method( 'create_for_id_and_type' )
					->with( $id, 'post' )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->build_indexable( $id );
	}
}
