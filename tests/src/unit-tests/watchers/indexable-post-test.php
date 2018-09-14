<?php

namespace Yoast\Tests\UnitTests\Watchers;

use Yoast\Tests\Doubles\Indexable_Post as Indexable_Post_Double;
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
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_meta_value()
	 */
	public function test_get_meta_value() {
		$instance = new Indexable_Post_Double();

		\WPSEO_Meta::set_value( 'a', 'b', 1 );

		$this->assertEquals( 'b', $instance->get_meta_value( 'a', 1 ) );
	}

	/**
	 * Tests the robots noindex lookup method
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_robots_noindex()
	 */
	public function test_get_robots_noindex() {
		$instance = new Indexable_Post_Double();

		$this->assertNull( $instance->get_robots_noindex( 0 ) );
		$this->assertNull( $instance->get_robots_noindex( 3 ) );
		$this->assertNull( $instance->get_robots_noindex( 6 ) );
		$this->assertNull( $instance->get_robots_noindex( 'a' ) );

		$this->assertTrue( $instance->get_robots_noindex( 1 ) );
		$this->assertTrue( $instance->get_robots_noindex( '1' ) );

		$this->assertFalse( $instance->get_robots_noindex( 2 ) );
		$this->assertFalse( $instance->get_robots_noindex( '2' ) );
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

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Watchers\Indexable_Post' )
			->setMethods(
				array(
					'is_post_indexable',
					'get_indexable',
					'get_permalink',
					'get_meta_data',
					'get_meta_lookup',
					'get_meta_value',
					'get_robots_noindex',
					'get_robots_options',
					'set_link_count',
					'save_social_meta',
				)
			)
			->getMock();

		$robots = array( 'robots_1', 'robots_2', 'robots_3' );

		$post_id = 1;

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
			->method( 'get_permalink' )
			->will( $this->returnValue( 'permalink' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_meta_lookup' )
			->will( $this->returnValue( array( 'a' => 'a' ) ) );

		$instance
			->expects( $this->exactly( 5 ) )
			->method( 'get_meta_value' )
			->withConsecutive(
				array( $this->equalTo('a') ),
				array( $this->equalTo('focuskw') ),
				array( $this->equalTo('linkdex') ),
				array( $this->equalTo('meta-robots-noindex') ),
				array( $this->equalTo('meta-robots-adv') )
			)
			->will( $this->onConsecutiveCalls(
				'a',
				'focus',
				2,
				1,
				'robots_1,robots_2'
			) );

		$instance
			->expects( $this->once() )
			->method( 'get_robots_noindex' )
			->with( 1 )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_robots_options' )
			->will( $this->returnValue( $robots ) );

		$instance
			->expects( $this->once() )
			->method( 'set_link_count' )
			->with( $post_id, $indexable_mock )
			->will( $this->returnValue( $indexable_mock ) );

		$instance
			->expects( $this->once() )
			->method( 'save_social_meta' )
			->with( $this->equalTo( $indexable_mock ), $this->equalTo( $post_id ) );

		// Set this value to true to let the routine think an indexable has been saved.
		$indexable_mock->id = true;

		$instance->save_meta( $post_id );

		$this->assertAttributeEquals( 'permalink', 'permalink', $indexable_mock );
		$this->assertAttributeEquals( true, 'is_robots_noindex', $indexable_mock );
		$this->assertAttributeEquals( 'a', 'a', $indexable_mock );
		$this->assertAttributeEquals( 1, 'is_robots_robots_1', $indexable_mock );
		$this->assertAttributeEquals( 1, 'is_robots_robots_2', $indexable_mock );
		$this->assertAttributeEquals( null, 'is_robots_robots_3', $indexable_mock );
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
	 * Tests if the meta lookup returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_meta_lookup()
	 */
	public function test_get_meta_lookup() {
		$instance = new Indexable_Post_Double();
		$this->assertInternalType( 'array', $instance->get_meta_lookup() );
	}

	/**
	 * Tests if robot options returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Watchers\Indexable_Post::get_robots_options()
	 */
	public function test_get_robots_options() {
		$instance = new Indexable_Post_Double();
		$this->assertInternalType( 'array', $instance->get_robots_options() );
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
