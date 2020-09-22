<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Exception;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Rebuilder;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group   indexables
 * @group   builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Rebuilder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Rebuilder
 */
class Indexable_Rebuilder_Test extends TestCase {

	/**
	 * Holds the Indexable_Rebuilder instance.
	 *
	 * @var Indexable_Rebuilder
	 */
	private $instance;

	/**
	 * Holds the Indexable_Repository instance.
	 *
	 * @var Indexable_Repository|Mockery\MockInterface
	 */
	private $repository;

	/**
	 * Holds the Indexable_Builder instance.
	 *
	 * @var Indexable_Builder|Mockery\MockInterface
	 */
	private $builder;

	/**
	 * Holds the Logger instance.
	 *
	 * @var Logger|Mockery\MockInterface
	 */
	private $logger;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->logger     = Mockery::mock( Logger::class );
		$this->instance   = new Indexable_Rebuilder( $this->repository, $this->builder, $this->logger );
	}

	/**
	 * Tests that the rebuild_for_type method calls the find method and builds each result.
	 *
	 * @covers ::rebuild_for_type
	 */
	public function test_rebuild_for_type() {
		$indexables = [
			(object) [ 'object_id' => 1 ],
			(object) [ 'object_id' => 2 ],
			(object) [ 'object_id' => 3 ],
		];

		$this->repository->expects( 'find_all_with_type' )->once()->with( 'user' )->andReturn( $indexables );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 1, 'user', $indexables[0] );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 2, 'user', $indexables[1] );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 3, 'user', $indexables[2] );

		$this->instance->rebuild_for_type( 'user' );
	}

	/**
	 * Tests that the rebuild_for_type method does not call the build method when no indexables were found.
	 *
	 * @covers ::rebuild_for_type
	 */
	public function test_rebuild_for_type_none_found() {
		$this->repository->expects( 'find_all_with_type' )->once()->with( 'user' )->andReturn( [] );
		$this->builder->expects( 'build_for_id_and_type' )->never();

		$this->instance->rebuild_for_type( 'user' );
	}

	/**
	 * Tests that the rebuild_for_type method catches exceptions.
	 *
	 * @covers ::rebuild_for_type
	 */
	public function test_rebuild_for_type_catches_exceptions() {
		$this->repository->expects( 'find_all_with_type' )
			->once()
			->with( 'user' )
			->andThrows( new Exception( 'an error' ) );
		$this->builder->expects( 'build_for_id_and_type' )->never();
		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->rebuild_for_type( 'user' );
	}

	/**
	 * Tests that the rebuild_for_type_and_sub_type method calls the find method and builds each result.
	 *
	 * @covers ::rebuild_for_type_and_sub_type
	 */
	public function test_rebuild_for_type_and_sub_type() {
		$indexables = [
			(object) [ 'object_id' => 1 ],
			(object) [ 'object_id' => 2 ],
			(object) [ 'object_id' => 3 ],
		];

		$this->repository->expects( 'find_all_with_type_and_sub_type' )->once()->with( 'post', 'custom-post' )->andReturn( $indexables );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 1, 'post', $indexables[0] );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 2, 'post', $indexables[1] );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 3, 'post', $indexables[2] );

		$this->instance->rebuild_for_type_and_sub_type( 'post', 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_type_and_sub_type method does not call the build method when no indexables were found.
	 *
	 * @covers ::rebuild_for_type_and_sub_type
	 */
	public function test_rebuild_for_type_and_sub_type_none_found() {
		$this->repository->expects( 'find_all_with_type_and_sub_type' )->once()->with( 'post', 'custom-post' )->andReturn( [] );
		$this->builder->expects( 'build_for_id_and_type' )->never();

		$this->instance->rebuild_for_type_and_sub_type( 'post', 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_type_and_sub_type method catches exceptions.
	 *
	 * @covers ::rebuild_for_type_and_sub_type
	 */
	public function test_rebuild_for_type_and_sub_type_catches_exceptions() {
		$this->repository->expects( 'find_all_with_type_and_sub_type' )
			->once()
			->with( 'post', 'custom-post' )
			->andThrows( new Exception( 'an error' ) );
		$this->builder->expects( 'build_for_id_and_type' )->never();
		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->rebuild_for_type_and_sub_type( 'post', 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_post_type_archive method calls the find method and builds each result.
	 *
	 * @covers ::rebuild_for_post_type_archive
	 */
	public function test_rebuild_for_post_type_archive() {
		$indexable = (object) [ 'object_id' => 1 ];

		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'custom-post', false )->andReturn( $indexable );
		$this->builder->expects( 'build_for_post_type_archive' )->once()->with( 'custom-post', $indexable );

		$this->instance->rebuild_for_post_type_archive( 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_post_type_archive method builds the post type archive even when no indexable was found.
	 *
	 * @covers ::rebuild_for_post_type_archive
	 */
	public function test_rebuild_for_post_type_archive_none_found() {
		$indexable = false;

		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'custom-post', false )->andReturn( $indexable );
		$this->builder->expects( 'build_for_post_type_archive' )->once()->with( 'custom-post', $indexable );

		$this->instance->rebuild_for_post_type_archive( 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_post_type_archive method catches exceptions.
	 *
	 * @covers ::rebuild_for_post_type_archive
	 */
	public function test_rebuild_for_post_type_archive_catches_exceptions() {
		$this->repository->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'custom-post', false )
			->andThrows( new Exception( 'an error' ) );
		$this->builder->expects( 'build_for_post_type_archive' )->never();
		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->rebuild_for_post_type_archive( 'custom-post' );
	}

	/**
	 * Tests that the rebuild_for_date_archive method calls the find method and builds each result.
	 *
	 * @covers ::rebuild_for_date_archive
	 */
	public function test_rebuild_for_date_archive() {
		$indexable = (object) [ 'object_id' => 1 ];

		$this->repository->expects( 'find_for_date_archive' )->once()->with( false )->andReturn( $indexable );
		$this->builder->expects( 'build_for_date_archive' )->once()->with( $indexable );

		$this->instance->rebuild_for_date_archive();
	}

	/**
	 * Tests that the rebuild_for_date_archive method builds the post type archive even when no indexable was found.
	 *
	 * @covers ::rebuild_for_date_archive
	 */
	public function test_rebuild_for_date_archive_none_found() {
		$indexable = false;

		$this->repository->expects( 'find_for_date_archive' )->once()->with( false )->andReturn( $indexable );
		$this->builder->expects( 'build_for_date_archive' )->once()->with( $indexable );

		$this->instance->rebuild_for_date_archive();
	}

	/**
	 * Tests that the rebuild_for_date_archive method catches exceptions.
	 *
	 * @covers ::rebuild_for_date_archive
	 */
	public function test_rebuild_for_date_archive_catches_exceptions() {
		$this->repository->expects( 'find_for_date_archive' )
			->once()
			->with( false )
			->andThrows( new Exception( 'an error' ) );
		$this->builder->expects( 'build_for_date_archive' )->never();
		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->rebuild_for_date_archive();
	}
}
