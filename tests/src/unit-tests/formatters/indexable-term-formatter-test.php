<?php

namespace Yoast\Tests\UnitTests\Formatters;

use Yoast\Tests\Doubles\Indexable_Term_Formatter_Double;

/**
 * Class Indexable_Term_Test
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Formatters
 */
class Indexable_Term_Formatter_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * @var Indexable_Term_Formatter_Double
	 */
	protected $instance;

	/**
	 * Sets up the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance =  new Indexable_Term_Formatter_Double( 1, 'category' );
	}

	/**
	 * Tests the formatting of the indexable data.
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::format
	 */
	public function test_format() {
		$formatter = $this
			->getMockBuilder( '\Yoast\YoastSEO\Formatters\Indexable_Term_Formatter' )
			->setConstructorArgs( array( 1, 'category' ) )
			->setMethods(
				array(
					'get_permalink',
					'get_meta_data',
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
			->method( 'get_meta_data' )
			->will(
				$this->returnValue(
					array(
						'wpseo_focuskw'         => 'focuskeyword',
						'wpseo_linkdex'         => 'linkdex',
						'wpseo_noindex'         => 'noindex',
						'wpseo_title'           => 'title',
						'wpseo_opengraph-title' => 'opengraph title'
					)
				)
			);

		$formatter
			->expects( $this->once() )
			->method( 'get_indexable_lookup' )
			->will(
				$this->returnValue(
					array(
						'wpseo_title' => 'title',
					)
				)
			);

		$formatter
			->expects( $this->once() )
			->method( 'get_indexable_meta_lookup' )
			->will(
				$this->returnValue(
					array(
						'wpseo_opengraph-title' => 'og_title',
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
			->expects( $this->exactly( 10 ) )
			->method( '__set' );

		$formatter->format( $indexable );
	}

	/**
	 * Tests the noindex expected outcome.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::get_noindex_value()
	 */
	public function test_get_noindex_value() {
		$this->assertTrue( $this->instance->get_noindex_value( 'noindex' ) );
		$this->assertFalse( $this->instance->get_noindex_value( 'index' ) );
		$this->assertNull( $this->instance->get_noindex_value( true ) );
		$this->assertNull( $this->instance->get_noindex_value( '' ) );
		$this->assertNull( $this->instance->get_noindex_value( false ) );
		$this->assertNull( $this->instance->get_noindex_value( 'weird-input-value' ) );
	}

	/**
	 * Tests retrieval of keyword scrore with keyword being set.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score() {
		$this->assertEquals( 100, $this->instance->get_keyword_score( 'keyword', 100 ) );
	}

	/**
	 * Tests retrieval of keyword scrore with no keyword being set.
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score_with_no_keyword() {
		$this->assertNull( $this->instance->get_keyword_score( '', 100 ) );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::get_indexable_lookup()
	 */
	public function test_get_indexable_lookup() {
		$this->assertInternalType( 'array', $this->instance->get_indexable_lookup() );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data
	 *
	 * @covers \Yoast\YoastSEO\Formatters\Indexable_Term_Formatter::get_indexable_meta_lookup()
	 */
	public function test_get_indexable_meta_lookup() {
		$this->assertInternalType( 'array', $this->instance->get_indexable_meta_lookup() );
	}

}