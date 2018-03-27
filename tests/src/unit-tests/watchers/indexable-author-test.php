<?php

namespace Yoast\Tests\UnitTests\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Watchers\Indexable_Author;
use Yoast\Tests\Doubles\Indexable_Author as Indexable_Author_Double;

/**
 * Class Indexable_Author_Test
 *
 * @group indexables
 * @group watchers
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
	 * Tests if the indexable is being deleted
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::delete_meta()
	 */
	public function test_delete_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Author' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new \Yoast\YoastSEO\Exceptions\No_Indexable_Found() ) );

		$instance->delete_meta( - 1 );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::get_indexable()
	 *
	 * @expectedException \Yoast\YoastSEO\Exceptions\No_Indexable_Found
	 */
	public function test_get_indexable_exception() {
		$instance = new Indexable_Author_Double();

		$instance->get_indexable( - 1, false );
	}

	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::get_indexable()
	 */
	public function test_get_indexable_create() {
		$instance = new Indexable_Author_Double();

		$this->assertInstanceOf( '\Yoast\YoastSEO\Yoast_Model', $instance->get_indexable( 1, true ) );
	}

	/**
	 * Tests the result value of get_sitemap_include_value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::get_sitemap_include_value()
	 */
	public function test_get_sitemap_include_value() {
		$instance = new Indexable_Author_Double();

		$this->assertFalse( $instance->get_sitemap_include_value( 'on' ) );

		$this->assertTrue( $instance->get_sitemap_include_value( 'off' ) );
		$this->assertTrue( $instance->get_sitemap_include_value( false ) );
		$this->assertTrue( $instance->get_sitemap_include_value( true ) );
	}

	/**
	 * Tests if get meta data returns expected data
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::get_meta_data()
	 */
	public function test_get_meta_data() {
		$instance = $this->getMockBuilder( 'Yoast\Tests\Doubles\Indexable_Author' )
						 ->setMethods( array( 'get_author_meta' ) )
						 ->getMock();

		$instance
			->expects( $this->atLeastOnce() )
			->method( 'get_author_meta' )
			->will( $this->returnValue( 'result' ) );

		/** @var Yoast\Tests\Doubles\Indexable_Author $instance */
		$this->assertInternalType( 'array', $instance->get_meta_data( 1 ) );
		$this->assertContains( 'result', $instance->get_meta_data( 1 ) );
	}

	/**
	 * Tests the save meta functionality
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::save_meta()
	 */
	public function test_save_meta() {
		$indexable_mock = $this
			->getMockBuilder( 'Yoast_Model_Mock' )
			->setMethods( array( 'save' ) )
			->getMock();

		$indexable_mock
			->expects( $this->once() )
			->method( 'save' );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Author' )
			->setMethods(
				array(
					'get_indexable',
					'get_permalink',
					'get_meta_data',
					'get_sitemap_include_value',
				)
			)
			->getMock();

		$author_meta = array(
			'wpseo_title'          => 'title',
			'wpseo_metadesc'       => 'metadesc',
			'wpseo_noindex_author' => 'on',
		);

		$author_id = - 1;

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->returnValue( $indexable_mock ) );

		$instance
			->expects( $this->once() )
			->method( 'get_permalink' )
			->will( $this->returnValue( 'permalink' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_meta_data' )
			->will( $this->returnValue( $author_meta ) );

		$instance->save_meta( $author_id );

		$this->assertAttributeEquals( 'permalink', 'permalink', $indexable_mock );
		$this->assertAttributeEquals( 'title', 'title', $indexable_mock );
		$this->assertAttributeEquals( 'metadesc', 'description', $indexable_mock );
	}

	/**
	 * Tests the save meta functionality
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Author::save_meta()
	 */
	public function test_save_meta_exception() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Author' )
			->setMethods( array( 'get_indexable' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_indexable' )
			->will( $this->throwException( new No_Indexable_Found() ) );

		$instance->save_meta( - 1 );
	}
}
