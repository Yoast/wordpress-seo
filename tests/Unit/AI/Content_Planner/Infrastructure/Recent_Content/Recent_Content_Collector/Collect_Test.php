<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;
use WP_Term;
use WPSEO_Meta;

/**
 * Tests Recent_Content_Collector::collect for the primary-category resolution cases.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector::collect
 */
final class Collect_Test extends Abstract_Recent_Content_Collector_Test {

	/**
	 * Builds a plain object mirroring the Indexable fields the collector reads.
	 *
	 * @return stdClass
	 */
	private function build_indexable_stub(): stdClass {
		$indexable                        = new stdClass();
		$indexable->object_id             = 42;
		$indexable->breadcrumb_title      = 'My Post Title';
		$indexable->description           = 'A description of the post.';
		$indexable->primary_focus_keyword = 'focus keyword';
		$indexable->is_cornerstone        = false;
		$indexable->object_last_modified  = '2024-01-15';
		$indexable->schema_article_type   = 'NewsArticle';

		return $indexable;
	}

	/**
	 * Tests that a Category from the Primary_Term_Repository is included on the Post.
	 *
	 * @return void
	 */
	public function test_collect_builds_post_with_primary_term_from_repository() {
		$indexable = $this->build_indexable_stub();

		$primary_term          = new stdClass();
		$primary_term->term_id = 7;

		$term          = Mockery::mock( WP_Term::class );
		$term->name    = 'Travel';
		$term->term_id = 7;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 100, false )
			->andReturn( [ $indexable ] );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 42, 'category', false )
			->andReturn( $primary_term );

		Functions\expect( 'get_term' )
			->once()
			->with( 7, 'category' )
			->andReturn( $term );

		$result = $this->instance->collect( 'post' );

		$this->assertSame(
			[
				[
					'title'                 => 'My Post Title',
					'description'           => 'A description of the post.',
					'category'              => [
						'name' => 'Travel',
						'id'   => 7,
					],
					'primary_focus_keyword' => 'focus keyword',
					'is_cornerstone'        => 0,
					'last_modified'         => '2024-01-15',
					'schema_article_type'   => 'NewsArticle',
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests that the post_meta fallback is used when the repository has no record.
	 *
	 * @return void
	 */
	public function test_collect_falls_back_to_post_meta_for_primary_category() {
		$indexable = $this->build_indexable_stub();

		$term          = Mockery::mock( WP_Term::class );
		$term->name    = 'News';
		$term->term_id = 3;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->andReturn( [ $indexable ] );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 42, 'category', false )
			->andReturn( null );

		Functions\expect( 'get_post_meta' )
			->once()
			->with( 42, WPSEO_Meta::$meta_prefix . 'primary_category', true )
			->andReturn( '3' );

		Functions\expect( 'get_term' )
			->once()
			->with( 3, 'category' )
			->andReturn( $term );

		$result = $this->instance->collect( 'post' );

		$posts = $result->to_array();
		$this->assertSame(
			[
				'name' => 'News',
				'id'   => 3,
			],
			$posts[0]['category'],
		);
	}

	/**
	 * Tests that when no explicit primary is set, the first WP-assigned category is used.
	 *
	 * @return void
	 */
	public function test_collect_falls_back_to_first_wp_assigned_category() {
		$indexable = $this->build_indexable_stub();

		$term          = Mockery::mock( WP_Term::class );
		$term->name    = 'General';
		$term->term_id = 11;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->andReturn( [ $indexable ] );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 42, 'category', false )
			->andReturn( null );

		Functions\expect( 'get_post_meta' )
			->once()
			->with( 42, WPSEO_Meta::$meta_prefix . 'primary_category', true )
			->andReturn( '' );

		Functions\expect( 'wp_get_post_categories' )
			->once()
			->with( 42 )
			->andReturn( [ 11, 22 ] );

		Functions\expect( 'get_term' )
			->once()
			->with( 11, 'category' )
			->andReturn( $term );

		$result = $this->instance->collect( 'post' );

		$posts = $result->to_array();
		$this->assertSame(
			[
				'name' => 'General',
				'id'   => 11,
			],
			$posts[0]['category'],
		);
	}

	/**
	 * Tests that a Post with no category at all emits `category: null`.
	 *
	 * @return void
	 */
	public function test_collect_emits_null_category_when_post_has_no_category_at_all() {
		$indexable = $this->build_indexable_stub();

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->andReturn( [ $indexable ] );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 42, 'category', false )
			->andReturn( null );

		Functions\expect( 'get_post_meta' )
			->once()
			->with( 42, WPSEO_Meta::$meta_prefix . 'primary_category', true )
			->andReturn( '' );

		Functions\expect( 'wp_get_post_categories' )
			->once()
			->with( 42 )
			->andReturn( [] );

		Functions\expect( 'get_term' )->never();

		$result = $this->instance->collect( 'post' );

		$posts = $result->to_array();
		$this->assertArrayHasKey( 'category', $posts[0] );
		$this->assertNull( $posts[0]['category'] );
	}

	/**
	 * Tests that a stale primary term id (term no longer exists) yields no category on the Post.
	 *
	 * @return void
	 */
	public function test_collect_emits_post_without_category_when_term_is_missing() {
		$indexable = $this->build_indexable_stub();

		$primary_term          = new stdClass();
		$primary_term->term_id = 99;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->andReturn( [ $indexable ] );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 42, 'category', false )
			->andReturn( $primary_term );

		Functions\expect( 'get_term' )
			->once()
			->with( 99, 'category' )
			->andReturn( null );

		$result = $this->instance->collect( 'post' );

		$posts = $result->to_array();
		$this->assertArrayHasKey( 'category', $posts[0] );
		$this->assertNull( $posts[0]['category'] );
	}
}
