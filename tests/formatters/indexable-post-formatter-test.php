<?php

namespace Yoast\WP\Free\Tests\Formatters;

use WPSEO_Meta;
use Brain\Monkey;
use Yoast\WP\Free\Tests\Doubles\Indexable_Post_Formatter_Double as Indexable_Post_Double;
use Yoast\WP\Free\Tests\TestCase;
use stdClass;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Formatter_Test extends TestCase {

	/**
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::format
	 */
	public function test_format() {
		Monkey\Functions\expect( 'get_permalink' )
			->once()
			->with( 1 )
			->andReturn( 'https://permalink' );

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 1 )
			->andReturn( 'post' );

		$formatter = $this
			->getMockBuilder( '\Yoast\WP\Free\Formatters\Indexable_Post_Formatter' )
			->setMethods(
				array(
					'get_meta_value',
					'get_indexable_lookup',
				)
			)
			->getMock();

		$formatter
			->expects( $this->any() )
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
						'opengraph-title' => 'og_title',
					)
				)
			);

		$indexable = $this->createMock( '\Yoast\WP\Free\Models\Indexable' );

		$indexable
			->expects( $this->any() )
			->method( '__set' );

		$formatter->format( 1, $indexable );
	}

	/**
	 * Tests retreiving a meta value.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_meta_value()
	 */
	public function test_get_meta_value() {
		Monkey\Functions\expect( 'update_post_meta' )
			->once()
			->with( 1, WPSEO_Meta::$meta_prefix . 'a', 'b' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_custom' )
			->once()
			->with( 1 )
			->andReturn( [ WPSEO_Meta::$meta_prefix . 'a' => 'b' ] );
		Monkey\Functions\expect( 'maybe_unserialize' )
			->once()
			->with( 'b' )
			->andReturn( 'b' );

		$instance = new Indexable_Post_Double();

		WPSEO_Meta::set_value( 'a', 'b', 1 );

		$this->assertSame( 'b', $instance->get_meta_value( 1, 'a' ) );
	}

	/**
	 * Tests the robots noindex lookup method.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_robots_noindex()
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
	 * Tests if robot options returns the expected type of data.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_robots_options()
	 */
	public function test_get_robots_options() {
		$instance = new Indexable_Post_Double();
		$this->assertInternalType( 'array', $instance->get_robots_options() );
	}

	/**
	 * Tests retrieval of keyword scrore with keyword being set.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score() {
		$instance = new Indexable_Post_Double();

		$this->assertSame( 100, $instance->get_keyword_score( 'keyword', 100 ) );
	}

	/**
	 * Tests retrieval of keyword scrore with no keyword being set.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score_with_no_keyword() {
		$instance = new Indexable_Post_Double();

		$this->assertNull( $instance->get_keyword_score( '', 100 ) );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::get_indexable_lookup()
	 */
	public function test_get_indexable_lookup() {
		$instance = new Indexable_Post_Double();
		$this->assertInternalType( 'array', $instance->get_indexable_lookup() );
	}

	/**
	 * Tests setting the link count for an indexable.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::set_link_count()
	 */
	public function test_set_link_count() {
		$formatter = $this
			->getMockBuilder( '\Yoast\WP\Free\Tests\Doubles\Indexable_Post_Formatter_Double' )
			->setMethods( array( 'get_seo_meta' ) )
			->getMock();

		$seo_meta                      = new stdClass();
		$seo_meta->internal_link_count = 404;
		$seo_meta->incoming_link_count = 1337;

		$formatter
			->expects( $this->once() )
			->method( 'get_seo_meta' )
			->will( $this->returnValue( $seo_meta ) );

		$indexable = new stdClass();
		$indexable = $formatter->set_link_count( 1, $indexable );

		$this->assertAttributeSame( 404, 'link_count', $indexable );
		$this->assertAttributeSame( 1337, 'incoming_link_count', $indexable );
	}

	/**
	 * Tests setting the link count for an indexable.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Post_Formatter::set_link_count()
	 */
	public function test_set_link_count_with_thrown_exception() {
		$formatter = $this
			->getMockBuilder( '\Yoast\WP\Free\Tests\Doubles\Indexable_Post_Formatter_Double' )
			->setMethods( array( 'get_seo_meta' ) )
			->getMock();


		$formatter
			->expects( $this->once() )
			->method( 'get_seo_meta' )
			->with( 1 )
			->will( $this->throwException( new \Exception() ) );

		$indexable = new stdClass();
		$indexable = $formatter->set_link_count( 1, $indexable );
	}
}
