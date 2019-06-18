<?php

namespace Yoast\WP\Free\Tests\Formatters;

use Brain\Monkey;
use Yoast\WP\Free\Tests\Doubles\Indexable_Author_Formatter_Double;
use Yoast\WP\Free\Tests\TestCase;
use stdClass;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Formatters
 */
class Indexable_Author_Formatter_Test extends TestCase {

	/**
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Author_Formatter::format
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Author_Formatter::get_meta_data
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Author_Formatter::get_noindex_value
	 */
	public function test_format() {
		Monkey\Functions\expect( 'get_author_posts_url' )
			->once()
			->with( 1 )
			->andReturn( 'https://permalink' );

		$formatter = $this
			->getMockBuilder( '\Yoast\WP\Free\Formatters\Indexable_Author_Formatter' )
			->setMethods( [ 'get_author_meta' ] )
			->getMock();

		$formatter
			->expects( $this->exactly( 3 ) )
			->method( 'get_author_meta' )
			->will(
				$this->onConsecutiveCalls(
					'title',
					'description',
					'on'
				)
			);

		$indexable = new stdClass();
		$indexable = $formatter->format( 1, $indexable );

		$this->assertAttributeSame( 'https://permalink', 'permalink', $indexable );
		$this->assertAttributeSame( 'title', 'title', $indexable );
		$this->assertAttributeSame( 'description', 'description', $indexable );
		$this->assertAttributeSame( true, 'is_robots_noindex', $indexable );
	}

	/**
	 * Tests the noindex expected outcome.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Author_Formatter::get_noindex_value
	 */
	public function test_get_noindex_value() {
		$instance = new Indexable_Author_Formatter_Double();

		$this->assertTrue( $instance->get_noindex_value( 'on' ) );
		$this->assertFalse( $instance->get_noindex_value( '' ) );
		$this->assertFalse( $instance->get_noindex_value( true ) );
		$this->assertFalse( $instance->get_noindex_value( false ) );
	}
}
