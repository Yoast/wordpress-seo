<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Term_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Term_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Term_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Term_Watcher
 */
class Indexable_Term_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder;

	/**
	 * The link builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * Represents the site helper.
	 *
	 * @var Mockery\MockInterface|Site_Helper
	 */
	private $site;

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Indexable_Term_Watcher
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository   = Mockery::mock( Indexable_Repository::class );
		$this->builder      = Mockery::mock( Indexable_Builder::class );
		$this->link_builder = Mockery::mock( Indexable_Link_Builder::class );
		$this->site         = Mockery::mock( Site_Helper::class );

		$this->instance = new Indexable_Term_Watcher(
			$this->repository,
			$this->builder,
			$this->link_builder,
			$this->site
		);
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Term_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'edited_term', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'delete_term', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'delete' )->once();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'term', false )
			->andReturn( $indexable_mock );

		$this->instance->delete_indexable( 1 );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'term', false )
			->andReturn( false );

		$this->instance->delete_indexable( 1 );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable() {
		Monkey\Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );
		$indexable->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );

		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$term = (object) [
			'taxonomy'    => 'tag',
			'description' => 'This is a term description, with a <a href="https://example.org/target">link</a>.',
		];

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->with( $term )
			->andReturnFalse();

		Monkey\Functions\expect( 'is_taxonomy_viewable' )
			->once()
			->with( $term->taxonomy )
			->andReturnTrue();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'term', false )
			->andReturn( $indexable );

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 1, 'term', $indexable )
			->andReturn( $indexable );

		$this->link_builder
			->expects( 'build' )
			->with(
				$indexable,
				'This is a term description, with a <a href="https://example.org/target">link</a>.'
			);

		$indexable
			->expects( 'save' )
			->once();

		$this->instance->build_indexable( 1 );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_with_null_term() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturnNull();

		$this->instance->build_indexable( 1 );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_error_term() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$term = 'WP_Error';

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->with( $term )
			->andReturnTrue();

		$this->instance->build_indexable( 1 );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_non_viewable_term() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$term = (object) [ 'taxonomy' => 'tag' ];

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->with( $term )
			->andReturnFalse();

		Monkey\Functions\expect( 'is_taxonomy_viewable' )
			->once()
			->with( $term->taxonomy )
			->andReturnFalse();

		$this->instance->build_indexable( 1 );
	}

	/**
	 * Tests the build indexable function on a multisite with a switch between the sites.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_on_multisite_with_a_site_switch() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnTrue();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->never()
			->with( 1, 'term', false );

		$this->instance->build_indexable( 1 );
	}

	/**
	 * Tests the build indexable functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_does_not_exist() {
		Monkey\Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );
		$indexable->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );

		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$term = (object) [
			'taxonomy'    => 'tag',
			'description' => 'This is a term description, with a <a href="https://example.org/target">link</a>.',
		];

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->with( $term )
			->andReturnFalse();

		Monkey\Functions\expect( 'is_taxonomy_viewable' )
			->once()
			->with( $term->taxonomy )
			->andReturnTrue();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'term', false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 1, 'term', false )
			->andReturn( $indexable );

		$this->link_builder
			->expects( 'build' )
			->with(
				$indexable,
				'This is a term description, with a <a href="https://example.org/target">link</a>.'
			);

		$indexable
			->expects( 'save' )
			->once();

		$this->instance->build_indexable( 1 );
	}
}
