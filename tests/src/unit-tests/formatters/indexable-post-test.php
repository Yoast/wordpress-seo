<?php

namespace Yoast\Tests\UnitTests\Formatters;

use Yoast\Tests\Doubles\Indexable_Post_Formatter as Indexable_Post_Double;


/**
 * Class Indexable_Post_Test
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::format
	 */
	public function test_format() {
		$formatter = $this
			->getMockBuilder( '\Yoast\YoastSEO\Formatters\Indexable_Post' )
			->setConstructorArgs( array( 1 ) )
			->setMethods(
				array(
					'get_permalink',
					'get_post_type',
					'get_meta_value',
					'get_indexable_lookup',
					'get_indexable_meta_lookup',
				)
			)
			->getMock();

		$formatter
			->expects( $this->once() )
			->method( 'get_permalink' )
			->will( $this->returnValue( 'https://permalink' ) );

		$formatter
			->expects( $this->once() )
			->method( 'get_post_type' )
			->will( $this->returnValue( 'post' ) );

		$formatter
			->expects( $this->exactly( 7 ) )
			->method( 'get_meta_value' )
			->will(
				$this->onConsecutiveCalls(
					'focuskeyword',
					100,
					1,
					1,
					'',
					'title',
					'og_title'
				)
			);

		$formatter
			->expects( $this->once() )
			->method( 'get_indexable_lookup' )
			->will(
				$this->returnValue(
					array(
						'title' => 'title',
					)
				)
			);

		$formatter
			->expects( $this->once() )
			->method( 'get_indexable_meta_lookup' )
			->will(
				$this->returnValue(
					array(
						'opengraph-title' => 'og_title',
					)
				)
			);

		$indexable = $this
			->getMockBuilder( '\Yoast\YoastSEO\Models\Indexable' )
			->setMethods( array( 'set_meta', '__set' ) )
			->getMock();

		$indexable
			->expects( $this->once() )
			->method( 'set_meta' );

		$indexable
			->expects( $this->exactly( 11 ) )
			->method( '__set' );

		$formatter->format( $indexable );
	}


	/**
	 * Tests retreiving a meta value
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_meta_value()
	 */
	public function test_get_meta_value() {
		$instance = new Indexable_Post_Double( 1 );

		\WPSEO_Meta::set_value( 'a', 'b', 1 );

		$this->assertEquals( 'b', $instance->get_meta_value( 'a' ) );
	}

	/**
	 * Tests the robots noindex lookup method
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_robots_noindex()
	 */
	public function test_get_robots_noindex() {
		$instance = new Indexable_Post_Double( 1 );

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
	 * Tests if robot options returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_robots_options()
	 */
	public function test_get_robots_options() {
		$instance = new Indexable_Post_Double( 1 );
		$this->assertInternalType( 'array', $instance->get_robots_options() );
	}

	/**
	 * Tests retrieval of keyword scrore with keyword being set.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_keyword_score()
	 */
	public function test_get_keyword_score() {
		$instance = new Indexable_Post_Double( 1 );

		$this->assertEquals( 100, $instance->get_keyword_score( 'keyword', 100 ) );
	}

	/**
	 * Tests retrieval of keyword scrore with no keyword being set.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_keyword_score()
	 */
	public function test_get_keyword_score_with_no_keyword() {
		$instance = new Indexable_Post_Double( 1 );

		$this->assertNull( $instance->get_keyword_score( '', 100 ) );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_indexable_lookup()
	 */
	public function test_get_indexable_lookup() {
		$instance = new Indexable_Post_Double( 1 );
		$this->assertInternalType( 'array', $instance->get_indexable_lookup() );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::get_indexable_meta_lookup()
	 */
	public function test_get_indexable_meta_lookup() {
		$instance = new Indexable_Post_Double( 1 );
		$this->assertInternalType( 'array', $instance->get_indexable_meta_lookup() );
	}

	/**
	 * Tests setting the link count for an indexable.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::set_link_count()
	 */
	public function test_set_link_count() {
		$formatter = $this
			->getMockBuilder( '\Yoast\Tests\Doubles\Indexable_Post_Formatter' )
			->setConstructorArgs( array( 1 ) )
			->setMethods(
				array(
					'get_seo_meta'
				)
			)
			->getMock();

		$seo_meta = new \stdClass();
		$seo_meta->internal_link_count = 404;
		$seo_meta->incoming_link_count = 1337;

		$formatter
			->expects( $this->once() )
			->method( 'get_seo_meta' )
			->will( $this->returnValue( $seo_meta ) );

		$indexable = new \stdClass();
		$indexable = $formatter->set_link_count( $indexable );

		$this->assertAttributeEquals( 404, 'link_count', $indexable  );
		$this->assertAttributeEquals( 1337, 'incoming_link_count', $indexable  );
	}

	/**
	 * Tests setting the link count for an indexable.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Post::set_link_count()
	 */
	public function test_set_link_count_with_thrown_exception() {
		$formatter = $this
			->getMockBuilder( '\Yoast\Tests\Doubles\Indexable_Post_Formatter' )
			->setConstructorArgs( array( 1 ) )
			->setMethods(
				array(
					'get_seo_meta'
				)
			)
			->getMock();


		$formatter
			->expects( $this->once() )
			->method( 'get_seo_meta' )
			->will( $this->throwException( new \Exception() ) );

		$indexable = new \stdClass();
		$indexable = $formatter->set_link_count( $indexable );
	}
}
