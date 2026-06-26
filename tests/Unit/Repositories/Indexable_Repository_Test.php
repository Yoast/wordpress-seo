<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Repository
 *
 * @group indexables
 * @group repositories
 */
final class Indexable_Repository_Test extends TestCase {

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	protected $builder;

	/**
	 * Represents the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * Represents the logger.
	 *
	 * @var Mockery\MockInterface|Logger
	 */
	protected $logger;

	/**
	 * Represents the indexable hierarchy repository.
	 *
	 * @var Mockery\Mock|Indexable_Hierarchy_Repository
	 */
	protected $hierarchy_repository;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Repository
	 */
	protected $instance;

	/**
	 * Represents the WordPress database.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Represents the Version Manager.
	 *
	 * @var Mockery\Mock|Indexable_Version_Manager
	 */
	protected $version_manager;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->builder              = Mockery::mock( Indexable_Builder::class );
		$this->current_page         = Mockery::mock( Current_Page_Helper::class );
		$this->logger               = Mockery::mock( Logger::class );
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->wpdb                 = Mockery::mock( wpdb::class );
		$this->version_manager      = Mockery::mock( Indexable_Version_Manager::class );
		$this->instance             = Mockery::mock(
			Indexable_Repository::class,
			[
				$this->builder,
				$this->current_page,
				$this->logger,
				$this->hierarchy_repository,
				$this->wpdb,
				$this->version_manager,
			],
		)->makePartial();
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_no_ancestors_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [] );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with one ancestor with no ancestor id found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_that_has_no_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 9 ] );

		$orm_object = $this->mock_orm( [ 9 ], [] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with one found ancestor.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_that_has_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink = 'https://example.org/post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$orm_object = $this->mock_orm( [ 1 ], [ $indexable ] );

		$this->mock_version_check( $indexable, $indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with multiple ancestors found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_with_multiple_ancestors() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink = 'https://example.org/post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$this->mock_version_check( $indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_checks_version() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		$resulting_indexable            = Mockery::mock( Indexable_Mock::class );
		$resulting_indexable->permalink = $permalink;

		$this->mock_version_check( $indexable, $resulting_indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $resulting_indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $resulting_indexable->permalink );
	}

	/**
	 * Tests that ensure permalink does not save when the permalink is still null.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_ensures_permalink_no_save() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->never();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->mock_version_check( $indexable );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertNull( $indexable->permalink );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available when there is only one ancestor.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_ensures_permalink() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->never();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$orm_object = $this->mock_orm( [ 1 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		$resulting_indexable            = Mockery::mock( Indexable_Mock::class );
		$resulting_indexable->permalink = $permalink;

		$this->mock_version_check( $indexable, $resulting_indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $resulting_indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $resulting_indexable->permalink );
	}

	/**
	 * Mocks the ORM object.
	 *
	 * @param array $indexable_ids The list of indexable IDs to expect to be retrieved.
	 * @param array $indexables    The list of indexables to expect to be retrieved.
	 *
	 * @return Mockery\Mock The mocked ORM object.
	 */
	private function mock_orm( $indexable_ids, $indexables ) {
		$orm_object = Mockery::mock( ORM::class )->makePartial();
		$orm_object
			->expects( 'where_in' )
			->with( 'id', $indexable_ids )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_expr' )
			->with( 'FIELD(id,' . \implode( ',', $indexable_ids ) . ')' )
			->andReturn( $orm_object );
		$orm_object
			->expects( 'find_many' )
			->andReturn( $indexables );

		return $orm_object;
	}

	/**
	 * Tests if the query method returns an instance of the ORM class that
	 * represents the Indexable.
	 *
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_query() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$GLOBALS['wpdb'] = $wpdb;

		$query = $this->instance->query();

		$this->assertEquals( '\Yoast\WP\SEO\Models\Indexable', $this->getPropertyValue( $query, 'class_name' ) );
		$this->assertInstanceOf( ORM::class, $query );
	}

	/**
	 * Tests retrieval of the child indexables with no children found for indexable.
	 *
	 * @covers ::find_by_ids
	 *
	 * @return void
	 */
	public function test_find_by_ids() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'where_in' )
			->with( 'id', [ 1, 2, 3 ] )
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'find_many' )
			->once()
			->andReturn( [ $indexable ] );

		$this->mock_version_check( $indexable, $indexable );

		$result = $this->instance->find_by_ids( [ 1, 2, 3 ] );

		$this->assertSame( [ $indexable ], $result );
	}

	/**
	 * Tests that find_posts_by_title_keywords ORs a whole-phrase LIKE clause per comma-separated value.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		$this->wpdb->expects( 'esc_like' )->with( 'hiking boots' )->once()->andReturn( 'hiking boots' );
		$this->wpdb->expects( 'esc_like' )->with( 'trail' )->once()->andReturn( 'trail' );

		$orm_object
			->expects( 'where_raw' )
			->with(
				'( breadcrumb_title LIKE %s OR breadcrumb_title LIKE %s )',
				[ '%hiking boots%', '%trail%' ],
			)
			->once()
			->andReturnSelf();

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( 10 )->once()->andReturnSelf();
		$orm_object->expects( 'offset' )->with( 0 )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( 'hiking boots, trail' ),
		);
	}

	/**
	 * Tests that a later page offsets the results by page size.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_paginated() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		$this->wpdb->expects( 'esc_like' )->with( 'trail' )->once()->andReturn( 'trail' );

		$orm_object
			->expects( 'where_raw' )
			->with( '( breadcrumb_title LIKE %s )', [ '%trail%' ] )
			->once()
			->andReturnSelf();

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( 10 )->once()->andReturnSelf();
		$orm_object->expects( 'offset' )->with( 20 )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( 'trail', 3 ),
		);
	}

	/**
	 * Tests that a single value is matched as one whole phrase, keeping its internal spaces, with no OR.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_single_value_is_one_phrase() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		$this->wpdb->expects( 'esc_like' )->with( 'hiking boots' )->once()->andReturn( 'hiking boots' );

		$orm_object
			->expects( 'where_raw' )
			->with(
				'( breadcrumb_title LIKE %s )',
				[ '%hiking boots%' ],
			)
			->once()
			->andReturnSelf();

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( 10 )->once()->andReturnSelf();
		$orm_object->expects( 'offset' )->with( 0 )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( 'hiking boots' ),
		);
	}

	/**
	 * Tests that find_posts_by_title_keywords returns an empty array for an empty or comma-only search.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_empty_search() {
		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( '   ' ) );
		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( ', ,' ) );
	}

	/**
	 * Tests that only the first MAX_TITLE_KEYWORD_PHRASES phrases are honoured and any beyond are ignored.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_caps_the_number_of_phrases() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		// Provide one more phrase than the cap; only the first MAX_TITLE_KEYWORD_PHRASES should be used.
		$phrases         = [];
		$expected_likes  = [];
		$expected_params = [];
		for ( $i = 1; $i <= ( Indexable_Repository::MAX_TITLE_KEYWORD_PHRASES + 1 ); $i++ ) {
			$phrases[] = 'k' . $i;
		}
		for ( $i = 1; $i <= Indexable_Repository::MAX_TITLE_KEYWORD_PHRASES; $i++ ) {
			$this->wpdb->expects( 'esc_like' )->with( 'k' . $i )->once()->andReturn( 'k' . $i );
			$expected_likes[]  = 'breadcrumb_title LIKE %s';
			$expected_params[] = '%k' . $i . '%';
		}

		// The phrase beyond the cap is never escaped, proving it is dropped before reaching the query.
		$orm_object
			->expects( 'where_raw' )
			->with(
				'( ' . \implode( ' OR ', $expected_likes ) . ' )',
				$expected_params,
			)
			->once()
			->andReturnSelf();

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( 10 )->once()->andReturnSelf();
		$orm_object->expects( 'offset' )->with( 0 )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( \implode( ', ', $phrases ) ),
		);
	}

	/**
	 * Tests that a page size below one is clamped to one rather than degrading into an empty or invalid LIMIT.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_clamps_page_size_below_one() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		$this->wpdb->expects( 'esc_like' )->with( 'trail' )->once()->andReturn( 'trail' );

		$orm_object
			->expects( 'where_raw' )
			->with( '( breadcrumb_title LIKE %s )', [ '%trail%' ] )
			->once()
			->andReturnSelf();

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( 1 )->once()->andReturnSelf();
		$orm_object->expects( 'offset' )->with( 0 )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( 'trail', 1, 0 ),
		);
	}

	/**
	 * Tests that a page size above the maximum is clamped to MAX_TITLE_KEYWORD_PAGE_SIZE, including its effect on the offset.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_find_posts_by_title_keywords_clamps_page_size_above_maximum() {
		$indexable  = Mockery::mock( Indexable_Mock::class );
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->once()
			->andReturn( $orm_object );

		$orm_object->expects( 'where' )->with( 'object_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where' )->with( 'object_sub_type', 'post' )->once()->andReturnSelf();
		$orm_object->expects( 'where_raw' )->with( '( is_public IS NULL OR is_public = 1 )' )->once()->andReturnSelf();

		$this->wpdb->expects( 'esc_like' )->with( 'trail' )->once()->andReturn( 'trail' );

		$orm_object
			->expects( 'where_raw' )
			->with( '( breadcrumb_title LIKE %s )', [ '%trail%' ] )
			->once()
			->andReturnSelf();

		$max = Indexable_Repository::MAX_TITLE_KEYWORD_PAGE_SIZE;

		$orm_object->expects( 'order_by_desc' )->with( 'object_last_modified' )->once()->andReturnSelf();
		$orm_object->expects( 'order_by_desc' )->with( 'id' )->once()->andReturnSelf();
		$orm_object->expects( 'limit' )->with( $max )->once()->andReturnSelf();
		// The clamped page size also drives the offset: ( page - 1 ) * clamped size.
		$orm_object->expects( 'offset' )->with( $max )->once()->andReturnSelf();
		$orm_object->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->assertSame(
			[ $indexable ],
			$this->instance->find_posts_by_title_keywords( 'trail', 2, ( $max + 50 ) ),
		);
	}

	/**
	 * Tests if the reset_permalink method fires when no type and subtype are passed.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 10 );

		$this->assertSame( 10, $this->instance->reset_permalink() );
	}

	/**
	 * Tests if the reset_permalink method fires when type and subtype are passed.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink_with_args() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->with( 'object_type', 'term' )
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->with( 'object_sub_type', 'category' )
			->andReturnSelf();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 1 );

		$this->assertSame( 1, $this->instance->reset_permalink( 'term', 'category' ) );
	}

	/**
	 * Tests if the reset_permalink method fires when no type is passed, but a subtype is.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink_with_invalid_args() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->never();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 10 );

		$this->assertSame( 10, $this->instance->reset_permalink( null, 'category' ) );
	}

	/**
	 * Tests if ensure_permalink sets the permalink to 'unindexed' when the post_status is 'unindexed'.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_permalink_set_to_unindexed_ensure_permalink() {
		/**
		 * Mock indexable.
		 *
		 * @var Mockery\MockInterface|Indexable $indexable
		 */
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->permalink   = null;
		$indexable->post_status = 'unindexed';

		$this->mock_version_check( $indexable, $indexable );

		$indexable = $this->instance->upgrade_indexable( $indexable );

		$this->assertSame( null, $indexable->permalink );
	}

	/**
	 * Test that the indexable is rebuilt if the version check says so.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_rebuild_indexable_if_outdated() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_version_check( $indexable, $indexable );

		$this->instance->upgrade_indexable( $indexable );
	}

	/**
	 * Test that the indexable is not rebuilt if the version check says not to.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_do_not_rebuild_indexable_if_up_to_date() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_version_check( $indexable );

		$this->instance->upgrade_indexable( $indexable );
	}

	/**
	 * Setup a version check to steer the upgrade routine.
	 *
	 * @param Indexable      $indexable        The mocked indexable.
	 * @param Indexable|null $indexable_result The mocked indexable after the upgrade routine is run.
	 *                                         If not provided, or set to `null`, we expect the upgrade routine to not be triggered.
	 *
	 * @return void
	 */
	private function mock_version_check( $indexable, $indexable_result = null ) {
		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $indexable )
			->andReturn( $indexable_result !== null );

		if ( $indexable_result ) {
			$this->builder
				->expects( 'build' )
				->once()
				->with( $indexable )
				->andReturn( $indexable_result );
		}
	}
}
