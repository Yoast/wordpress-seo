<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Mockery;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group canonical
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * @var Mockery\MockInterface
	 */
	private $wp_rewrite;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->setInstance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the canonical is given.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_canonical() {
		$this->indexable->canonical = 'https://example.com/my-post';

		$this->assertEquals( 'https://example.com/my-post', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where no canonical is given, and it should fall back to the permalink.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_canonical() {
		$this->indexable->object_id = 1337;
		$this->indexable->permalink = 'https://example.com/permalink';

		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'page' )
			->andReturn( 0 );

		$this->url_helper
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing( function( $val ) {
				return $val;
			} );

		$this->assertEquals( 'https://example.com/permalink', $this->instance->generate_canonical() );
	}

	/**
	 * Tests a post with pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination() {
		$this->indexable->object_id       = 1337;
		$this->indexable->number_of_pages = 2;
		$this->indexable->permalink       = 'https://example.com/permalink';

		$this->wp_rewrite = Mockery::mock( 'WP_Rewrite' );
		$this->wp_rewrite_wrapper
			->expects( 'get' )
			->zeroOrMoreTimes()
			->andReturn( $this->wp_rewrite );

		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'page' )
			->andReturn( 2 );

		$this->wp_rewrite
			->expects( 'using_permalinks' )
			->once()
			->andReturn( true );

		$this->url_helper
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing( function( $val ) {
				return $val;
			} );

		$this->assertEquals( 'https://example.com/permalink/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests a post with pagination when no permalink structure is set.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination_no_permalink_structure() {
		$this->indexable->object_id       = 1337;
		$this->indexable->number_of_pages = 2;
		$this->indexable->permalink       = 'https://example.com/?post=123';

		$this->wp_rewrite = Mockery::mock( 'WP_Rewrite' );
		$this->wp_rewrite_wrapper
			->expects( 'get' )
			->zeroOrMoreTimes()
			->andReturn( $this->wp_rewrite );

		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'page' )
			->andReturn( 2 );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'page', 2, 'https://example.com/?post=123' )
			->andReturn( 'https://example.com/?post=123&page=2' );

		$this->wp_rewrite
			->expects( 'using_permalinks' )
			->once()
			->andReturn( false );

		$this->url_helper
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing( function( $val ) {
				return $val;
			} );

		$this->assertEquals( 'https://example.com/?post=123&page=2', $this->instance->generate_canonical() );
	}
}
