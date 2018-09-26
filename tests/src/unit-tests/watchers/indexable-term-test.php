<?php

namespace Yoast\Tests\UnitTests\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Watchers\Indexable_Term;
use Yoast\Tests\Doubles\Indexable_Term_Watcher as Indexable_Term_Double;

/**
 * Class Indexable_Term_Test
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Term_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests if the expected hooks are registered
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::register_hooks()
	 */
	public function test_register_hooks() {
		$instance = new Indexable_Term();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'created_term', array( $instance, 'save_meta' ) ) );
		$this->assertNotFalse( \has_action( 'edited_term', array( $instance, 'save_meta' ) ) );
		$this->assertNotFalse( \has_action( 'deleted_term', array( $instance, 'delete_meta' ) ) );
	}

	/**
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::delete_meta()
	 */
	public function test_delete_meta() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
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
			->with( $id, 'taxonomy', false )
			->will( $this->returnValue( $indexable_mock ) );

		$instance->delete_meta( $id, '', 'taxonomy' );
	}

	/**
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::delete_meta()
	 */
	public function test_delete_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new \Yoast\YoastSEO\Exceptions\No_Indexable_Found() ) );

		$instance->delete_meta( 1, '', 'taxonomy' );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::get_indexable()
	 *
	 * @expectedException \Yoast\YoastSEO\Exceptions\No_Indexable_Found
	 */
	public function test_get_indexable_exception() {
		$instance = new Indexable_Term_Double();

		$instance->get_indexable( 1, '',false );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::get_indexable()
	 */
	public function test_get_indexable_create() {
		$instance = new Indexable_Term_Double();

		$this->assertInstanceOf( '\Yoast\YoastSEO\Yoast_Model', $instance->get_indexable( 1, '',true ) );
	}

	/**
	 * Tests the save meta
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::save_meta()
	 */
	public function test_save_meta() {
		$taxonomy_id = 1;

		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$formatter_mock = $this
			->getMockBuilder( '\Yoast\YoastSEO\Formatters\Indexable_Author' )
			->setConstructorArgs( array( $taxonomy_id ) )
			->setMethods( array( 'format' ) )
			->getMock();

		$formatter_mock
			->expects($this->once() )
			->method( 'format' )
			->with( $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
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

		$instance
			->expects( $this->once() )
			->method( 'get_formatter' )
			->will( $this->returnValue( $formatter_mock ) );

		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->save_meta( $taxonomy_id, '', 'taxonomy' );
	}

	/**
	 * Tests the save meta functionality
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::save_meta()
	 */
	public function test_save_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->save_meta( -1, '', 'taxonomy' );
	}
}
