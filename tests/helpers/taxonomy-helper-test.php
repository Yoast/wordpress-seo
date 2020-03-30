<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Taxonomy_Helper
 */
class Taxonomy_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Represents the string helper.
	 *
	 * @var Mockery\MockInterface|String_Helper
	 */
	private $string;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->string   = Mockery::mock( String_Helper::class );
		$this->instance = Mockery::mock( Taxonomy_Helper::class, [ $this->options, $this->string ] )->makePartial();
	}

	/**
	 * Tests the status when the option value is set to false.
	 *
	 * @covers ::is_indexable
	 */
	public function test_is_indexable() {
		$this->options
			->expects( 'get' )
			->with( 'noindex-tax-category', false )
			->andReturnFalse();

		$this->assertTrue( $this->instance->is_indexable( 'category' ) );
	}

	/**
	 * Tests the status when the option value is set to true.
	 *
	 * @covers ::is_indexable
	 */
	public function test_is_indexable_with_no_index_set_to_true() {
		$this->options
			->expects( 'get' )
			->with( 'noindex-tax-category', false )
			->andReturnTrue();

		$this->assertFalse( $this->instance->is_indexable( 'category' ) );
	}

	/**
	 * Tests the retrieval of the term description
	 *
	 * @covers ::get_term_description
	 */
	public function test_get_term_description() {
		Monkey\Functions\expect( 'term_description' )
			->once()
			->with( 1337 )
			->andReturn( 'Term description' );

		$this->string
			->expects( 'strip_all_tags' )
			->with( 'Term description' )
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->get_term_description( 1337 ) );
	}

	/**
	 * Tests if the term exists.
	 *
	 * @covers ::term_exists
	 */
	public function test_term_exists() {
		Monkey\Functions\expect( 'term_exists' )
			->once()
			->with( 1337 )
			->andReturn( 1337 );

		$this->assertTrue( $this->instance->term_exists( 1337 ) );
	}

	/**
	 * Tests if a non existing term exists.
	 *
	 * @covers ::term_exists
	 */
	public function test_term_exists_not_found() {
		Monkey\Functions\expect( 'term_exists' )
			->once()
			->with( 1337 )
			->andReturnNull();

		$this->assertFalse( $this->instance->term_exists( 1337 ) );
	}

	/**
	 * Tests if term exists with fallback to the VIP function.
	 *
	 * @covers ::term_exists
	 */
	public function test_term_exists_using_vip_function() {
		Monkey\Functions\expect( 'wpcom_vip_term_exists' )
			->once()
			->with( 1337 )
			->andReturn( 1337 );

		$this->assertTrue( $this->instance->term_exists( 1337 ) );
	}
}
