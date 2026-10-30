<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_Identifier_Resolver class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver
 */
final class Term_Identifier_Resolver_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The instance under test.
	 *
	 * @var Term_Identifier_Resolver
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

		$this->instance = new Term_Identifier_Resolver( $this->indexable_repository );
	}

	/**
	 * Tests resolve_one by term ID.
	 *
	 * @covers ::__construct
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
			->with( 7, 'term', false )
			->andReturn( $indexable );

		$this->assertSame( $indexable, $this->instance->resolve_one( [ 'term_id' => 7 ] ) );
	}

	/**
	 * Tests resolve_one by term ID returns an error when the term is unknown.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_id_not_found() {
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'term', false )
			->andReturn( false );

		$this->assertInstanceOf( WP_Error::class, $this->instance->resolve_one( [ 'term_id' => 7 ] ) );
	}

	/**
	 * Tests that the term ID wins when both identifiers are provided.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_id
	 *
	 * @return void
	 */
	public function test_resolve_one_prefers_id_over_permalink() {
		$indexable = Mockery::mock();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 7, 'term', false )
			->andReturn( $indexable );
		$this->indexable_repository->expects( 'find_by_permalink' )->never();

		$this->assertSame(
			$indexable,
			$this->instance->resolve_one(
				[
					'term_id'   => 7,
					'permalink' => 'https://example.com/category/news/',
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
		$indexable              = Mockery::mock();
		$indexable->object_type = 'term';

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/category/news/' )
			->andReturn( $indexable );

		$this->assertSame(
			$indexable,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/category/news/' ] ),
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
			->with( 'https://example.com/category/missing/' )
			->andReturn( false );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/category/missing/' ] ),
		);
	}

	/**
	 * Tests resolve_one by permalink rejects a permalink that belongs to a non-term indexable.
	 *
	 * @covers ::resolve_one
	 * @covers ::by_permalink
	 * @covers ::invalid_identifier
	 *
	 * @return void
	 */
	public function test_resolve_one_by_permalink_not_a_term() {
		$indexable              = Mockery::mock();
		$indexable->object_type = 'post';

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'https://example.com/hello/' )
			->andReturn( $indexable );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->resolve_one( [ 'permalink' => 'https://example.com/hello/' ] ),
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
