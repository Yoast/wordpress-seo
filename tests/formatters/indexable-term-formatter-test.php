<?php

namespace Yoast\WP\Free\Tests\Formatters;

use Brain\Monkey;
use Yoast\WP\Free\Tests\Doubles\Indexable_Term_Formatter_Double;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group formatters
 *
 * @package Yoast\Tests\Formatters
 */
class Indexable_Term_Formatter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var \Yoast\WP\Free\Tests\Doubles\Indexable_Term_Formatter_Double
	 */
	protected $instance;

	/**
	 * Sets up the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Indexable_Term_Formatter_Double();
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::format
	 */
	public function test_format() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'get_term_link' )
			->once()
			->with( 1, 'category' )
			->andReturn( 'https://example.org/category/1' );

		$formatter = $this
			->getMockBuilder( '\Yoast\WP\Free\Formatters\Indexable_Term_Formatter' )
			->setMethods(
				array(
					'get_indexable_lookup',
					'get_indexable_meta_lookup',
				)
			)
			->getMock();

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
			->getMockBuilder( '\Yoast\WP\Free\Models\Indexable' )
			->setMethods( array( 'set_meta', '__set' ) )
			->getMock();

		$indexable
			->expects( $this->once() )
			->method( 'set_meta' );
		$indexable
			->expects( $this->exactly( 10 ) )
			->method( '__set' );

		$formatter->format( 1, 'category', $indexable );
	}

	/**
	 * Tests the noindex expected outcome.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::get_noindex_value()
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
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score() {
		$this->assertSame( 100, $this->instance->get_keyword_score( 'keyword', 100 ) );
	}

	/**
	 * Tests retrieval of keyword scrore with no keyword being set.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::get_keyword_score()
	 */
	public function test_get_keyword_score_with_no_keyword() {
		$this->assertNull( $this->instance->get_keyword_score( '', 100 ) );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::get_indexable_lookup()
	 */
	public function test_get_indexable_lookup() {
		$this->assertInternalType( 'array', $this->instance->get_indexable_lookup() );
	}

	/**
	 * Tests if the meta lookup returns the expected type of data.
	 *
	 * @covers \Yoast\WP\Free\Formatters\Indexable_Term_Formatter::get_indexable_meta_lookup()
	 */
	public function test_get_indexable_meta_lookup() {
		$this->assertInternalType( 'array', $this->instance->get_indexable_meta_lookup() );
	}
}
