<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Permalink_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Permalink_Helper
 *
 * @group helpers
 */
final class Permalink_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Permalink_Helper
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Permalink_Helper();
	}

	/**
	 * Retrieves the permalink for a post indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_post_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		Monkey\Functions\expect( 'get_permalink' )
			->andReturn( 'https://example.org/permalink' );

		$this->assertEquals(
			'https://example.org/permalink',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for an attachment indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_attachment_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = 'attachment';

		Monkey\Functions\expect( 'wp_get_attachment_url' )
			->andReturn( 'https://example.org/attachment' );

		$this->assertEquals(
			'https://example.org/attachment',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a home page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_homepage_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'home-page';

		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org/homepage' );

		$this->assertEquals(
			'https://example.org/homepage',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_term_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $term )
			->andReturn( false );

		Monkey\Functions\expect( 'get_term_link' )
			->with( $term, 'category' )
			->andReturn( 'https://example.org/term' );

		$this->assertEquals(
			'https://example.org/term',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable and term not found.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_term_indexable_term_not_found() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( null );

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable with term being wp_error.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_term_indexable_term_is_wp_error() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $term )
			->andReturn( true );

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_search_page_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'system-page';
		$indexable->object_sub_type = 'search-page';

		Monkey\Functions\expect( 'get_search_link' )
			->andReturn( 'https://example.org/search' );

		$this->assertEquals(
			'https://example.org/search',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_post_type_archive_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post-type-archive';
		$indexable->object_sub_type = 'post-type';

		Monkey\Functions\expect( 'get_post_type_archive_link' )
			->with( 'post-type' )
			->andReturn( 'https://example.org/post-type' );

		$this->assertEquals(
			'https://example.org/post-type',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_user_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'user';
		$indexable->object_id   = 1;

		Monkey\Functions\expect( 'get_author_posts_url' )
			->with( 1 )
			->andReturn( 'https://example.org/user/1' );

		$this->assertEquals(
			'https://example.org/user/1',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 *
	 * @return void
	 */
	public function test_get_permalink_for_unknown_type_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'unknown';

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}
}
