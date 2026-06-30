<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_Identifier_Resolver;
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
		$indexable = Mockery::mock();

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
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_returns_all() {
		$matches = [ Mockery::mock(), Mockery::mock() ];

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
	 *
	 * @return void
	 */
	public function test_resolve_many_by_title_forwards_page() {
		$matches = [ Mockery::mock() ];

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
