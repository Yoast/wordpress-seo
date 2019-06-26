<?php

namespace Yoast\WP\Free\Tests\Watchers;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Formatters\Indexable_Author_Formatter;
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
		$instance = new Indexable_Author_Watcher( new Indexable_Author_Formatter() );
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
		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Watchers\Indexable_Author_Watcher' )
			->setConstructorArgs( [ new Indexable_Author_Formatter() ] )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$indexable_mock = $this
			->getMockBuilder( 'Yoast\WP\Free\Yoast_Model' )
			->setMethods( array( 'delete', 'delete_indexable' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete' );

		$indexable_mock
			->expects( $this->once() )
			->method( 'delete_indexable' );

		$id = 1;

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->with( $id, false )
			->will( $this->returnValue( $indexable_mock ) );

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
			->setConstructorArgs( [ new Indexable_Author_Formatter() ] )
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
			->getMockBuilder( '\Yoast\WP\Free\Formatters\Indexable_Author_Formatter' )
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
			->setConstructorArgs( [ new Indexable_Author_Formatter() ] )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->build_indexable( - 1 );
	}
}
