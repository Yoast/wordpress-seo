<?php

namespace Yoast\WP\Free\Tests\Watchers;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Helpers\Indexable_Helper;
use Yoast\WP\Free\Watchers\Indexable_Author_Watcher;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Author_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Author_Watcher::register_hooks
	 */
	public function test_register_hooks() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->getMock();

		$instance = new Indexable_Author_Watcher( $helper_mock, new Indexable_Author_Builder() );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'profile_update', array( $instance, 'build_indexable' ) ) );
		$this->assertNotFalse( \has_action( 'deleted_user', array( $instance, 'delete_indexable' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Author_Watcher::delete_indexable
	 */
	public function test_delete_indexable() {
		$helper_mock = $this->getMockBuilder( Indexable_Helper::class )
							->disableOriginalConstructor()
							->setMethods( [ 'find_by_id_and_type' ] )
							->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'delete', 'delete_indexable' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$id = 1;

		$helper_mock->expects( $this->once() )
					->method( 'find_by_id_and_type' )
					->with( $id, 'user', false )
					->willReturn( $indexable_mock );

		$instance = new Indexable_Author_Watcher( $helper_mock, new Indexable_Author_Builder() );

		$instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Author_Watcher::delete_indexable
	 */
	public function test_delete_indexable_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Author_Watcher' )
			->setConstructorArgs( [ new Indexable_Author_Builder() ] )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->delete_indexable( - 1 );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Author_Watcher::build_indexable
	 */
	public function test_build_indexable() {
		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$author_id = 1;

		$formatter_mock = $this
			->getMockBuilder( '\Yoast\WP\Free\Builders\Indexable_Author_Builder' )
			->setMethods( array( 'format' ) )
			->getMock();

		$formatter_mock
			->expects( $this->once() )
			->method( 'format' )
			->with( $author_id, $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Author_Watcher' )
			->setConstructorArgs( [ $formatter_mock ] )
			->setMethods(
				array(
					'get_indexable',
					'get_formatter',
				)
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->returnValue( $indexable_mock ) );


		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->build_indexable( $author_id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers \Yoast\WP\Free\Watchers\Indexable_Author_Watcher::build_indexable
	 */
	public function test_build_indexable_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Author_Watcher' )
			->setConstructorArgs( [ new Indexable_Author_Builder() ] )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->build_indexable( - 1 );
	}
}
