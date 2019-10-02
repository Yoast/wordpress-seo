<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();

		$this->robots_helper
			->expects( 'after_generate' )
			->once()
			->andReturnUsing( function ( $robots ) {
				return $robots;
			} );
	}

	/**
	 * Tests the generate_robots with default settings.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots() {
		$this->setup_wp_query_wrapper();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->with( $this->indexable )
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->current_page_helper
			->expects( 'is_multiple_terms_page' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->with( 'category' )
			->andReturn( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether generate_robots sets noindex when a taxonomy is set to not be indexed.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_taxonomy_not_indexable() {
		$this->setup_wp_query_wrapper();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->with( $this->indexable )
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->current_page_helper
			->expects( 'is_multiple_terms_page' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->with( 'category' )
			->andReturn( false );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether generate_robots sets index when a taxonomy is set to not be indexed, but the
	 * queried term is.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_taxonomy_not_indexable_term_indexable() {
		$this->setup_wp_query_wrapper();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->with( $this->indexable )
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->current_page_helper
			->expects( 'is_multiple_terms_page' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->with( 'category' )
			->andReturn( false );

		$this->indexable->is_robots_noindex = false;

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether generate_robots sets noindex when a taxonomy is set to be indexed, but the
	 * queried term is not.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_taxonomy_indexable_term_not_indexable() {
		$this->setup_wp_query_wrapper();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->with( $this->indexable )
			->andReturn( [
				'index'  => 'noindex',
				'follow' => 'follow',
			] );

		$this->current_page_helper
			->expects( 'is_multiple_terms_page' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->with( 'category' )
			->andReturn( true );

		$this->indexable->is_robots_noindex = true;

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether generate_robots sets noindex when multiple terms are being queried.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_multi_terms_page() {
		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->with( $this->indexable )
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->current_page_helper
			->expects( 'is_multiple_terms_page' )
			->once()
			->andReturn( true );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->never();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Setup default WP_Query_Wrapper.
	 */
	private function setup_wp_query_wrapper() {
		$wp_query = Mockery::mock( '\WP_Query' );
		$wp_query
			->expects( 'get_queried_object' )
			->zeroOrMoreTimes()
			->andReturn( (object) [
				'taxonomy' => 'category',
			] );
		$this->wp_query_wrapper
			->expects( 'get_query' )
			->zeroOrMoreTimes()
			->andReturn( $wp_query );
	}
}
