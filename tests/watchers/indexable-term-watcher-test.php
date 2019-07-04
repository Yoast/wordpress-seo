<?php

namespace Yoast\WP\Free\Tests\Watchers;

use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Helpers\Indexable_Helper;
use Yoast\WP\Free\Watchers\Indexable_Term_Watcher;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Term_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Term_Watcher::register_hooks
	 */
	public function test_register_hooks() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->getMock();

		$instance = new Indexable_Term_Watcher( $helper_mock, new Indexable_Term_Builder() );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'edited_term', array( $instance, 'build_indexable' ) ) );
		$this->assertNotFalse( \has_action( 'delete_term', array( $instance, 'delete_indexable' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Term_Watcher::delete_indexable
	 */
	public function test_delete_indexable() {
		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'delete', 'delete_indexable' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$id = 1;

		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'term', false )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Term_Watcher( $helper_mock, new Indexable_Term_Builder() );

		$instance->delete_indexable( $id, '', 'taxonomy' );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Term_Watcher::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;

		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'term', false )
					->willReturn( false );

		$instance = new Indexable_Term_Watcher( $helper_mock, new Indexable_Term_Builder() );

		$instance->delete_indexable( 1, '', 'taxonomy' );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Term_Watcher::build_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( [ 'save' ] )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$builder_mock = $this
			->getMockBuilder( '\Yoast\WP\Free\Builders\Indexable_Term_Builder' )
			->setMethods( [ 'build' ] )
			->getMock();

		$builder_mock
			->expects( $this->once() )
			->method( 'build' )
			->with( $id, $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'term', false )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Term_Watcher( $helper_mock, $builder_mock );

		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->build_indexable( $id );
	}

	/**
	 * Tests the build indexable functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Term_Watcher::build_indexable
	 */
	public function test_build_does_not_exist() {
		$id = 1;

		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( [ 'save' ] )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [
								'find_by_id_and_type',
								'create_for_id_and_type',
							] )
							->getMock();

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'term', false )
					->willReturn( false );

		$helper_mock->expects( $this->once() )
					->method( 'create_for_id_and_type' )
					->with( $id, 'term' )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Term_Watcher( $helper_mock, new Indexable_Term_Builder() );

		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->build_indexable( $id );
	}
}
