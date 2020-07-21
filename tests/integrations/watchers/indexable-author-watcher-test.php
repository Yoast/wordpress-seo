<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Watchers
 */

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Author_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Author_Watcher
 * @covers ::<!public>
 */
class Indexable_Author_Watcher_Test extends TestCase {

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
	 * Represents the instance to test.
	 *
	 * @var Indexable_Author_Watcher
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance   = new Indexable_Author_Watcher( $this->repository, $this->builder );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Author_Watcher::get_conditionals()
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

		$this->assertNotFalse( \has_action( 'profile_update', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'deleted_user', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'delete' )->once();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $id, 'user', false )
			->andReturn( $indexable_mock );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_not_found() {
		$id = 1;

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $id, 'user', false )
			->andReturn( false );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $id, 'user', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( $id, 'user', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_not_found() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $id, 'user', false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( $id, 'user', false )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}
}
