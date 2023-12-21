<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Primary_Term_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Primary_Term_Helper
 */
final class Primary_Term_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Primary_Term_Helper
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Primary_Term_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the retrieval of the primary term taxonomies.
	 *
	 * @covers ::get_primary_term_taxonomies
	 * @covers ::filter_hierarchical_taxonomies
	 *
	 * @return void
	 */
	public function test_get_primary_term_taxonomies() {
		$taxonomies = [
			(object) [
				'name'         => 'category',
				'hierarchical' => true,
			],
		];

		Monkey\Functions\expect( 'get_object_taxonomies' )
			->once()
			->with( 'post', 'objects' )
			->andReturn(
				[
					(object) [
						'name'         => 'category',
						'hierarchical' => true,
					],
					(object) [
						'name'         => 'tag',
						'hierarchical' => false,
					],
				]
			);

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 1 )
			->andReturn( 'post' );

		Monkey\Filters\expectApplied( 'wpseo_primary_term_taxonomies' )
			->with( $taxonomies, 'post', $taxonomies );

		$this->assertEquals( $taxonomies, $this->instance->get_primary_term_taxonomies( 1 ) );
	}

	/**
	 * Tests that no non-hierarchical taxonomies are returned.
	 *
	 * @covers ::get_primary_term_taxonomies
	 * @covers ::filter_hierarchical_taxonomies
	 *
	 * @return void
	 */
	public function test_get_primary_term_taxonomies_no_hierarchical() {

		Monkey\Functions\expect( 'get_object_taxonomies' )
			->once()
			->with( 'post', 'objects' )
			->andReturn(
				[
					(object) [
						'name'         => 'category',
						'hierarchical' => false,
					],
					(object) [
						'name'         => 'tag',
						'hierarchical' => false,
					],
				]
			);

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 1 )
			->andReturn( 'post' );

		Monkey\Filters\expectApplied( 'wpseo_primary_term_taxonomies' )
			->with( [], 'post', [] );

		$this->assertEquals( [], $this->instance->get_primary_term_taxonomies( 1 ) );
	}
}
