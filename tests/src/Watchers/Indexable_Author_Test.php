<?php

namespace Yoast\Tests\Watchers;

use Yoast\YoastSEO\Watchers\Indexable_Author;

/**
 * Class Indexable_Author_Test
 *
 * @group   yoastmeta
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Author_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests if the expected hooks are registered
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::register_hooks()
	 */
	public function test_register_hooks() {
		$instance = new Indexable_Author();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'profile_update', array( $instance, 'save_meta' ) ) );
		$this->assertNotFalse( \has_action( 'deleted_user', array( $instance, 'delete_meta' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::delete_meta()
	 */
	public function test_delete_meta() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Author' )
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
	 * Tests if a non-indexable is not being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::delete_meta()
	 */
	public function test_delete_meta_no_indexable() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Author' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$non_indexable = $this
			->getMockBuilder( 'Some_Class' )
			->setMethods( array( 'delete' ) )
			->getMock();

		$non_indexable
			->expects( $this->never() )
			->method( 'delete' );

		$id = 1;

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->with( $id, false )
			->will( $this->returnValue( $non_indexable ) );

		$instance->delete_meta( $id );
	}
}
