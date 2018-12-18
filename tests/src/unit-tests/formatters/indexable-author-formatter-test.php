<?php

namespace Yoast\Tests\UnitTests\Formatters;

use Yoast\Tests\Doubles\Indexable_Author_Formatter_Double;

/**
 * Class Indexable_Author_Test
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Formatters
 */
class Indexable_Author_Formatter_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Author_Formatter::format
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Author_Formatter::get_meta_data
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Author_Formatter::get_noindex_value
	 */
	public function test_format() {
		$formatter = $this
			->getMockBuilder( '\Yoast\YoastSEO\Formatters\Indexable_Author_Formatter' )
			->setConstructorArgs( array( 1 ) )
			->setMethods( array( 'get_permalink', 'get_author_meta' ) )
			->getMock();

		$formatter
			->expects( $this->once() )
			->method( 'get_permalink' )
			->will( $this->returnValue( 'https://permalink' ) );

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

		$indexable = new \stdClass();
		$indexable = $formatter->format( $indexable );

		$this->assertAttributeEquals( 'https://permalink', 'permalink', $indexable );
		$this->assertAttributeEquals( 'title', 'title', $indexable );
		$this->assertAttributeEquals( 'description', 'description', $indexable );
		$this->assertAttributeEquals( true, 'is_robots_noindex', $indexable );
	}

	/**
	 * Tests the noindex expected outcome.
	 */
	public function test_get_noindex_value() {
		$instance = new Indexable_Author_Formatter_Double( 1 );

		$this->assertTrue( $instance->get_noindex_value( 'on' ) );
		$this->assertFalse( $instance->get_noindex_value( '' ) );
		$this->assertFalse( $instance->get_noindex_value( true ) );
		$this->assertFalse( $instance->get_noindex_value( false ) );
	}
}
