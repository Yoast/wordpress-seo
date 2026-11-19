<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Identifier_Resolver class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver
 */
final class Author_Identifier_Resolver_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The author archive helper mock.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * The URL helper mock.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	private $url_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_Identifier_Resolver
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
				'__'           => static function ( $text ) {
					return $text;
				},
				'wp_parse_url' => static function ( $url, $component = -1 ) {
					// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url -- Mirrors the wrapped function.
					return \parse_url( $url, $component );
				},
			],
		);

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->author_archive_helper = Mockery::mock( Author_Archive_Helper::class );
		$this->url_helper            = Mockery::mock( Url_Helper::class );

		$this->author_archive_helper->allows( 'are_disabled' )->andReturnFalse();

		$this->instance = new Author_Identifier_Resolver( $this->indexable_repository, $this->author_archive_helper, $this->url_helper );
	}

	/**
	 * Tests resolve_one by user ID.
	 *
	 * @covers ::__construct
	 * @covers ::resolve_one
	 * @covers ::by_id
	 * @covers ::has
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( Mockery::mock( 'WP_User' ) );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturn( $indexable );

		$this->assertSame( $indexable, $this->instance->resolve_one( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests resolve_one by user ID returns an error when the user does not exist.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id_not_found() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturnFalse();
		$this->indexable_repository->expects( 'find_by_id_and_type' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests that resolve_one by user ID returns an excluded error when the user exists but has no indexable.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id_excluded() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( Mockery::mock( 'WP_User' ) );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturnFalse();

		$result = $this->instance->resolve_one( [ 'user_id' => 7 ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_author_archive_excluded', $result->get_error_code() );
	}

	/**
	 * Tests that resolve_one returns an error without any lookup while author archives are disabled.
	 *
	 * @covers ::resolve_one
	 *
	 * @return void
	 */
	public function test_resolve_one_author_archives_disabled() {
		$author_archive_helper = Mockery::mock( Author_Archive_Helper::class );
		$author_archive_helper->expects( 'are_disabled' )->once()->andReturnTrue();
		Monkey\Functions\expect( 'get_userdata' )->never();
		$this->indexable_repository->expects( 'find_by_id_and_type' )->never();
		$this->indexable_repository->expects( 'find_by_permalink' )->never();

		$instance = new Author_Identifier_Resolver( $this->indexable_repository, $author_archive_helper, $this->url_helper );
		$result   = $instance->resolve_one( [ 'user_id' => 7 ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_author_archives_disabled', $result->get_error_code() );
	}

	/**
	 * Tests that the user ID wins when both identifiers are provided.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_prefers_id_over_permalink() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( Mockery::mock( 'WP_User' ) );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturn( $indexable );
		$this->indexable_repository->expects( 'find_by_permalink' )->never();

		$this->assertSame(
			$indexable,
			$this->instance->resolve_one(
				[
					'user_id'   => 7,
					'permalink' => 'https://example.com/author/jane/',
				],
			),
		);
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
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'user';

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/author/jane/' )
			->andReturn( $indexable );

		$this->assertSame(
			$indexable,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/author/jane/' ] ),
		);
	}

	/**
	 * Tests resolve_one by permalink returns a not-found error when no indexable or author matches.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_not_found() {
		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/author/missing/' )
			->andReturn( false );
		Monkey\Functions\expect( 'get_user_by' )->once()->with( 'slug', 'missing' )->andReturnFalse();
		Monkey\Functions\expect( 'get_author_posts_url' )->never();

		$result = $this->instance->resolve_one( [ 'permalink' => 'https://example.com/author/missing/' ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_permalink', $result->get_error_code() );
	}

	/**
	 * Tests that resolve_one by pretty permalink returns an excluded error for an author without an indexable.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_by_pretty_permalink_excluded() {
		$permalink = 'https://example.com/author/jane/';
		$user      = Mockery::mock( 'WP_User' );
		$user->ID  = 7;

		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		Monkey\Functions\expect( 'get_user_by' )->once()->with( 'slug', 'jane' )->andReturn( $user );
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 7 )->andReturn( $permalink );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( $user );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturnFalse();

		$result = $this->instance->resolve_one( [ 'permalink' => $permalink ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_author_archive_excluded', $result->get_error_code() );
	}

	/**
	 * Tests that resolve_one by plain permalink returns an excluded error for an author without an indexable.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_by_plain_permalink_excluded() {
		$permalink = 'https://example.com/?author=7';
		$user      = Mockery::mock( 'WP_User' );
		$user->ID  = 7;

		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		$this->url_helper->expects( 'parse_str_params' )->once()->with( 'author=7' )->andReturn( [ 'author' => '7' ] );
		Monkey\Functions\expect( 'get_user_by' )->never();
		Monkey\Functions\expect( 'get_userdata' )->twice()->with( 7 )->andReturn( $user );
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 7 )->andReturn( $permalink );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturnFalse();

		$result = $this->instance->resolve_one( [ 'permalink' => $permalink ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_author_archive_excluded', $result->get_error_code() );
	}

	/**
	 * Tests that resolve_one by plain permalink rejects an author query var on a site with pretty author URLs.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_plain_permalink_author_url_mismatch() {
		$permalink = 'https://example.com/?author=7';
		$user      = Mockery::mock( 'WP_User' );
		$user->ID  = 7;

		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		$this->url_helper->expects( 'parse_str_params' )->once()->with( 'author=7' )->andReturn( [ 'author' => '7' ] );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( $user );
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 7 )->andReturn( 'https://example.com/author/jane/' );
		$this->indexable_repository->expects( 'find_by_id_and_type' )->never();

		$result = $this->instance->resolve_one( [ 'permalink' => $permalink ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_permalink', $result->get_error_code() );
	}

	/**
	 * Tests that resolve_one by permalink returns the indexable when its stored permalink is outdated.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_stale_indexable_permalink() {
		$permalink = 'https://example.com/author/jane/';
		$user      = Mockery::mock( 'WP_User' );
		$user->ID  = 7;
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		Monkey\Functions\expect( 'get_user_by' )->once()->with( 'slug', 'jane' )->andReturn( $user );
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 7 )->andReturn( $permalink );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( $user );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'user', false )
			->andReturn( $indexable );

		$this->assertSame( $indexable, $this->instance->resolve_one( [ 'permalink' => $permalink ] ) );
	}

	/**
	 * Tests that resolve_one by permalink rejects a candidate author whose archive URL differs from the permalink.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @dataProvider provide_non_author_archive_permalinks
	 *
	 * @param string $permalink The permalink whose last segment matches a user nicename.
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_author_url_mismatch( string $permalink ) {
		$user     = Mockery::mock( 'WP_User' );
		$user->ID = 7;

		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		Monkey\Functions\expect( 'get_user_by' )->once()->with( 'slug', 'jane' )->andReturn( $user );
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 7 )->andReturn( 'https://example.com/author/jane/' );
		Monkey\Functions\expect( 'get_userdata' )->never();
		$this->indexable_repository->expects( 'find_by_id_and_type' )->never();

		$result = $this->instance->resolve_one( [ 'permalink' => $permalink ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_permalink', $result->get_error_code() );
	}

	/**
	 * Data provider for test_resolve_one_by_permalink_author_url_mismatch.
	 *
	 * @return array<string, array<string, string>> The permalinks.
	 */
	public static function provide_non_author_archive_permalinks(): array {
		return [
			'post with the same slug' => [ 'permalink' => 'https://example.com/jane/' ],
			'other host'              => [ 'permalink' => 'https://other.com/author/jane/' ],
		];
	}

	/**
	 * Tests that resolve_one by plain permalink returns a not-found error when no author query var is present.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::find_author_id_by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @dataProvider provide_plain_permalinks_without_author
	 *
	 * @param string                              $permalink  The plain permalink.
	 * @param string                              $query      The query string of the permalink.
	 * @param array<string, string|array<string>> $query_vars The parsed query vars.
	 *
	 * @return void
	 */
	public function test_resolve_one_by_plain_permalink_without_author( string $permalink, string $query, array $query_vars ) {
		$this->indexable_repository->expects( 'find_by_permalink' )->once()->with( $permalink )->andReturn( false );
		$this->url_helper->expects( 'parse_str_params' )->once()->with( $query )->andReturn( $query_vars );
		Monkey\Functions\expect( 'get_userdata' )->never();
		Monkey\Functions\expect( 'get_user_by' )->never();

		$result = $this->instance->resolve_one( [ 'permalink' => $permalink ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_permalink', $result->get_error_code() );
	}

	/**
	 * Data provider for test_resolve_one_by_plain_permalink_without_author.
	 *
	 * @return array<string, array<string, string|array<string, string|array<string>>>> The permalinks with their parsed query.
	 */
	public static function provide_plain_permalinks_without_author(): array {
		return [
			'other query var'     => [
				'permalink'  => 'https://example.com/?p=7',
				'query'      => 'p=7',
				'query_vars' => [ 'p' => '7' ],
			],
			'author var as array' => [
				'permalink'  => 'https://example.com/?author[]=7',
				'query'      => 'author[]=7',
				'query_vars' => [ 'author' => [ '7' ] ],
			],
		];
	}

	/**
	 * Tests resolve_one by permalink rejects a permalink that belongs to a non-user indexable.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_not_an_author() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
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
	 * Tests resolve_one returns an error when no usable identifier is provided.
	 *
	 * @covers ::resolve_one
	 * @covers ::has
	 *
	 * @dataProvider provide_missing_identifiers
	 *
	 * @param array<string, int|string> $input The input without a usable identifier.
	 *
	 * @return void
	 */
	public function test_resolve_one_missing_identifier( array $input ) {
		$this->indexable_repository->expects( 'find_by_id_and_type' )->never();
		$this->indexable_repository->expects( 'find_by_permalink' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( $input ) );
	}

	/**
	 * Data provider for test_resolve_one_missing_identifier.
	 *
	 * @return array<string, array<string, array<string, int|string>>> The inputs.
	 */
	public static function provide_missing_identifiers(): array {
		return [
			'empty input'     => [ 'input' => [] ],
			'empty permalink' => [ 'input' => [ 'permalink' => '' ] ],
		];
	}
}
