<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
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
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->author_archive_helper = Mockery::mock( Author_Archive_Helper::class );

		$this->author_archive_helper->allows( 'are_disabled' )->andReturnFalse();

		$this->instance = new Author_Identifier_Resolver( $this->indexable_repository, $this->author_archive_helper );
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

		$instance = new Author_Identifier_Resolver( $this->indexable_repository, $author_archive_helper );
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
	 * Tests resolve_one by permalink returns an error when nothing matches.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
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

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/author/missing/' ] ),
		);
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
