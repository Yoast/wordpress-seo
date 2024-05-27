<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Initializers\Primary_Term_Metadata;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Primary_Term_Metadata_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Primary_Term_Metadata
 */
final class Primary_Term_Metadata_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Primary_Term_Metadata
	 */
	private $instance;

	/**
	 * Primary term helper
	 *
	 * @var Mockery\MockInterface|Primary_Term_Helper
	 */
	private $primary_term_helper;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->primary_term_helper = Mockery::mock( Primary_Term_Helper::class );

		$this->instance = new Primary_Term_Metadata( $this->primary_term_helper );
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 *
	 * @return void
	 */
	public function test_initialize() {
		$this->instance->initialize();

		$this->assertNotFalse( \has_action( 'rest_api_init', [ $this->instance, 'register_primary_terms_field' ] ), 'Does not have expected rest_api_init action' );
	}

	/**
	 * Tests the register_primary_terms_field method.
	 *
	 * @covers ::register_primary_terms_field
	 *
	 * @return void
	 */
	public function test_register_primary_terms_field() {
		Monkey\Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 1 );

		$this->primary_term_helper->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'post',
				'_yoast_wpseo_primary_terms',
				[
					'get_callback'    => [ $this->instance, 'get_primary_terms' ],
					'update_callback' => [ $this->instance, 'save_primary_terms' ],
					'schema'          => [
						'arg_options' => [
							'sanitize_callback' => [ $this->instance, 'sanitize_primary_terms' ],
						],
						'type'        => 'object',
						'properties'  => [ 'category' => [ 'type' => 'string' ] ],
						'context'     => [ 'edit' ],
					],
				]
			);
		$this->instance->register_primary_terms_field();
	}

	/**
	 * Tests the save_primary_terms method.
	 *
	 * @covers ::save_primary_terms
	 *
	 * @return void
	 */
	public function test_save_primary_terms_update() {
		$post     = Mockery::mock( 'WP_Post' );
		$post->ID = 1;

		$primary_terms = [ 'category' => '5' ];

		Monkey\Functions\expect( 'update_post_meta' )
			->once()
			->with( 1, '_yoast_wpseo_primary_category', '5' );

		$this->instance->save_primary_terms( $primary_terms, $post );
	}

	/**
	 * Tests the save_primary_terms method.
	 *
	 * @covers ::save_primary_terms
	 *
	 * @return void
	 */
	public function test_save_primary_terms_delete_row() {
		$post     = Mockery::mock( 'WP_Post' );
		$post->ID = 1;

		$primary_terms = [ 'category' => '' ];

		Monkey\Functions\expect( 'delete_post_meta' )
			->once()
			->with( 1, '_yoast_wpseo_primary_category' );

		$this->instance->save_primary_terms( $primary_terms, $post );
	}

	/**
	 * Data provider for the sanitize_primary_terms method.
	 *
	 * @return array<string|int>|null
	 */
	public static function data_provider_sanitize_primary_terms() {
		return [
			'empty' => [
				'input'    => [],
				'expected' => [],
			],
			'null' => [
				'input'    => null,
				'expected' => [],
			],
			'minus and zero values' => [
				'input'    => [
					'category'  => '0',
					'tags'      => -1,
					'category2' => 0,
					'tags2'     => '-2',
				],
				'expected' => [
					'category'  => '',
					'tags'      => '',
					'category2' => '',
					'tags2'     => '',
				],
			],
		];
	}

	/**
	 * Tests the sanitize_primary_terms method.
	 *
	 * @dataProvider data_provider_sanitize_primary_terms
	 *
	 * @covers ::sanitize_primary_terms
	 *
	 * @param array<string|int>|null $input    The input to sanitize.
	 * @param array<string>          $expected The expected output.
	 *
	 * @return void
	 */
	public function test_sanitize_primary_terms( $input, $expected ) {
		$this->assertEquals( $expected, $this->instance->sanitize_primary_terms( $input ) );
	}

	/**
	 * Tests the get_primary_terms method.
	 *
	 * @covers ::get_primary_terms
	 *
	 * @return void
	 */
	public function test_get_primary_terms() {
		$this->primary_term_helper->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

			Monkey\Functions\expect( 'get_post_meta' )
				->once()
				->with( 1, '_yoast_wpseo_primary_category', true )
				->andReturn( '5' );

		$this->assertEquals( [ 'category' => '5' ], $this->instance->get_primary_terms( [ 'id' => 1 ] ) );
	}

	/**
	 * Tests the get_primary_terms method.
	 *
	 * @covers ::get_primary_terms
	 *
	 * @return void
	 */
	public function test_get_primary_terms_false() {
		$this->primary_term_helper->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

			Monkey\Functions\expect( 'get_post_meta' )
				->once()
				->with( 1, '_yoast_wpseo_primary_category', true )
				->andReturn( false );

		$this->assertEquals( [ 'category' => '' ], $this->instance->get_primary_terms( [ 'id' => 1 ] ) );
	}
}
