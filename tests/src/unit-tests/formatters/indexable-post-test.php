<?php

namespace Yoast\Tests\UnitTests\Formatters;

use Yoast\Tests\Doubles\Indexable_Post as Indexable_Post_Double;


/**
 * Class Indexable_Post_Test
 *
 * @group indexables
 * @group watchers
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Test extends \PHPUnit_Framework_TestCase {

	public function format() {
		$formatter_instance = new Indexable_Post_Double( 2 );

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

}
