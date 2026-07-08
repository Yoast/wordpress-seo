<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_Identifier_Resolver;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_Identifier_Resolver class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Post_Identifier_Resolver
 */
final class Post_Identifier_Resolver_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The instance under test.
	 *
	 * @var Post_Identifier_Resolver
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Post_Identifier_Resolver(
			$this->indexable_repository,
		);
	}

	/**
	 * Tests resolve_one by post ID.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 * @covers ::has
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id() {
		$indexable = Mockery::mock();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$this->assertSame( $indexable, $this->instance->resolve_one( [ 'post_id' => 42 ] ) );
	}

	/**
	 * Tests resolve_one by post ID returns an error when the post is unknown.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 * @covers ::not_found
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id_not_found() {
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( false );

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( [ 'post_id' => 42 ] ) );
	}

	/**
	 * Tests resolve_one by permalink via an exact indexable match.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink() {
		$indexable              = Mockery::mock();
		$indexable->object_type = 'post';

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/hello/' )
			->andReturn( $indexable );

		$this->assertSame(
			$indexable,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/hello/' ] ),
		);
	}

	/**
	 * Tests resolve_one by permalink returns an error when nothing matches.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_not_found() {
		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/missing/' )
			->andReturn( false );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/missing/' ] ),
		);
	}

	/**
	 * Tests resolve_one by permalink rejects an indexable that is not a post.
	 *
	 * The permalink lookup is not scoped by object type, so a term, author, or
	 * archive URL can match an indexable too; those must not resolve.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_rejects_non_post() {
		$indexable              = Mockery::mock();
		$indexable->object_type = 'term';

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/category/news/' )
			->andReturn( $indexable );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/category/news/' ] ),
		);
	}

	/**
	 * Tests resolve_one ignores title keywords and returns a missing-identifier error.
	 *
	 * Title keywords are not a valid identifier for the write path, so they must
	 * not resolve a post; only post_id and permalink are accepted.
	 *
	 * @covers ::resolve_one
	 *
	 * @return void
	 */
	public function test_resolve_one_ignores_title() {
		$this->indexable_repository->expects( 'find_posts_by_title_keywords' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( [ 'title' => 'hello world' ] ) );
	}

	/**
	 * Tests resolve_one with no identifier returns a missing-identifier error.
	 *
	 * @covers ::resolve_one
	 *
	 * @return void
	 */
	public function test_resolve_one_missing_identifier() {
		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( [] ) );
	}

	/**
	 * Tests resolve_many with no identifier returns a missing-identifier error.
	 *
	 * @covers ::resolve_many
	 *
	 * @return void
	 */
	public function test_resolve_many_missing_identifier() {
		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_many( [] ) );
	}

	/**
	 * Tests resolve_many by title returns all matches on the default first page.
	 *
	 * @covers ::resolve_many
	 * @covers ::by_title
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_returns_all() {
		$matches = [ Mockery::mock( Indexable::class ), Mockery::mock( Indexable::class ) ];

		$this->indexable_repository
			->expects( 'find_posts_by_title_keywords' )
			->once()
			->with( 'guide', 1 )
			->andReturn( $matches );

		$this->assertSame( $matches, $this->instance->resolve_many( [ 'title' => 'guide' ] ) );
	}

	/**
	 * Tests resolve_many by title forwards the requested page.
	 *
	 * @covers ::resolve_many
	 * @covers ::by_title
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_forwards_page() {
		$matches = [ Mockery::mock( Indexable::class ) ];

		$this->indexable_repository
			->expects( 'find_posts_by_title_keywords' )
			->once()
			->with( 'guide', 3 )
			->andReturn( $matches );

		$this->assertSame(
			$matches,
			$this->instance->resolve_many(
				[
					'title' => 'guide',
					'page'  => 3,
				],
			),
		);
	}

	/**
	 * Tests resolve_many by title returns a not-found error when nothing matches.
	 *
	 * @covers ::resolve_many
	 * @covers ::by_title
	 * @covers ::not_found
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_not_found() {
		$this->indexable_repository
			->expects( 'find_posts_by_title_keywords' )
			->once()
			->with( 'nothing', 1 )
			->andReturn( [] );

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_many( [ 'title' => 'nothing' ] ) );
	}

	/**
	 * Tests resolve_many by title returns an empty list for an empty later page.
	 *
	 * The page parameter's schema documents that an empty result means there are
	 * no further pages, so paging past the last result is not an invalid identifier.
	 *
	 * @covers ::resolve_many
	 * @covers ::by_title
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_empty_later_page() {
		$this->indexable_repository
			->expects( 'find_posts_by_title_keywords' )
			->once()
			->with( 'guide', 2 )
			->andReturn( [] );

		$this->assertSame(
			[],
			$this->instance->resolve_many(
				[
					'title' => 'guide',
					'page'  => 2,
				],
			),
		);
	}

	/**
	 * Tests resolve_many by title returns a not-found error when a match is not an indexable.
	 *
	 * @covers ::resolve_many
	 * @covers ::by_title
	 * @covers ::not_found
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_non_indexable_element() {
		$this->indexable_repository
			->expects( 'find_posts_by_title_keywords' )
			->once()
			->with( 'guide', 1 )
			->andReturn( [ Mockery::mock( Indexable::class ), Mockery::mock() ] );

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_many( [ 'title' => 'guide' ] ) );
	}

	/**
	 * Tests resolve_many by post ID wraps the single match in an array.
	 *
	 * @covers ::resolve_many
	 *
	 * @return void
	 */
	public function test_resolve_many_by_id() {
		$indexable = Mockery::mock();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'post', false )
			->andReturn( $indexable );

		$this->assertSame( [ $indexable ], $this->instance->resolve_many( [ 'post_id' => 7 ] ) );
	}

	/**
	 * Tests resolve_many by post ID propagates a not-found error.
	 *
	 * @covers ::resolve_many
	 *
	 * @return void
	 */
	public function test_resolve_many_by_id_not_found() {
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->andReturn( false );

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_many( [ 'post_id' => 7 ] ) );
	}
}
