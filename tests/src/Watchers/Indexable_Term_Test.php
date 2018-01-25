<?php

namespace Yoast\Tests\Watchers;

use Yoast\YoastSEO\Watchers\Indexable_Term;
use Yoast\Tests\Doubles\Indexable_Term as Indexable_Term_Double;

/**
 * Class Indexable_Term_Test
 *
 * @group   yoastmeta
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Term_Test extends \PHPUnit_Framework_TestCase {
	/**
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
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::delete_meta()
	 */
	public function test_delete_meta_no_indexable() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
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
			->with( $id, 'taxonomy', false )
			->will( $this->returnValue( $non_indexable ) );

		$instance->delete_meta( $id, '', 'taxonomy' );
	}

	/**
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::get_meta_lookup()
	 */
	public function test_get_meta_lookup() {
		$instance = new Indexable_Term_Double();
		$this->assertInternalType( 'array', $instance->get_meta_lookup() );
	}

	/**
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::get_sitemap_include_value()
	 */
	public function test_get_sitemap_include_value() {
		$instance = new Indexable_Term_Double();

		$this->assertFalse( $instance->get_sitemap_include_value( 'always' ) );
		$this->assertTrue( $instance->get_sitemap_include_value( 'never' ) );

		$this->assertNull( $instance->get_sitemap_include_value( 'other' ) );
		$this->assertNull( $instance->get_sitemap_include_value( '1' ) );
		$this->assertNull( $instance->get_sitemap_include_value( true ) );
		$this->assertNull( $instance->get_sitemap_include_value( false ) );
	}

	/**
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Term::save_meta()
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
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Term' )
			->setMethods(
				array(
					'get_indexable',
					'get_permalink',
					'get_meta_data',
					'get_meta_lookup',
					'get_sitemap_include_value',
				)
			)
			->getMock();

		$term_meta = array(
			'a' => 'a',
			'wpseo_sitemap_include' => 1,
		);

		$post_id = 1;

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
			->will( $this->returnValue( $term_meta ) );

		$instance
			->expects( $this->once() )
			->method( 'get_meta_lookup' )
			->will( $this->returnValue( array( 'a' => 'a' ) ) );

		$instance
			->expects( $this->once() )
			->method( 'get_sitemap_include_value' )
			->with( 1 )
			->will( $this->returnValue( true ) );

		$instance->save_meta( $post_id, '', 'taxonomy' );

		$this->assertAttributeEquals( 'permalink', 'permalink', $indexable_mock );
		$this->assertAttributeEquals( 'a', 'a', $indexable_mock );
		$this->assertAttributeEquals( 1, 'include_in_sitemap', $indexable_mock );
	}
}
