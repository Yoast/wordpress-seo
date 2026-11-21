<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Taxonomy_Helper
 */
final class Taxonomy_Helper_Test extends TestCase {

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
	 * Prepares the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->string   = Mockery::mock( String_Helper::class );
		$this->instance = Mockery::mock( Taxonomy_Helper::class, [ $this->options, $this->string ] )->makePartial();
	}

	/**
	 * Tests the status when the option value is set to false.
	 *
	 * @covers ::is_indexable
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_is_indexable_with_no_index_set_to_true() {
		$this->options
			->expects( 'get' )
			->with( 'noindex-tax-category', false )
			->andReturnTrue();

		$this->assertFalse( $this->instance->is_indexable( 'category' ) );
	}

	/**
	 * Tests that the WordPress function is called with the expected parameters.
	 *
	 * @covers ::get_public_taxonomies
	 *
	 * @return void
	 */
	public function test_get_public_taxonomies() {
		Functions\expect( 'get_taxonomies' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturn( [] );

		$this->instance->get_public_taxonomies();
	}

	/**
	 * Tests that the WordPress function is called with the expected parameters.
	 *
	 * @covers ::get_public_taxonomies
	 *
	 * @return void
	 */
	public function test_get_public_taxonomies_with_objects() {
		Functions\expect( 'get_taxonomies' )
			->once()
			->with( [ 'public' => true ], 'objects' )
			->andReturn( [] );

		$this->instance->get_public_taxonomies( 'objects' );
	}

	/**
	 * Tests the retrieval of the term description
	 *
	 * @covers ::get_term_description
	 *
	 * @return void
	 */
	public function test_get_term_description() {
		Functions\expect( 'term_description' )
			->once()
			->with( 1337 )
			->andReturn( 'Term description' );

		$this->string
			->expects( 'strip_all_tags' )
			->with( 'Term description' )
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->get_term_description( 1337 ) );
	}
}
