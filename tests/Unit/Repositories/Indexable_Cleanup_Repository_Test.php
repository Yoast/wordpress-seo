<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Brain\Monkey;
use Mockery;
use stdClass;
use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Cleanup_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Cleanup_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Cleanup_Repository
 *
 * @group indexables
 * @group repositories
 */
final class Indexable_Cleanup_Repository_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Indexable_Cleanup_Repository
	 */
	private $instance;

	/**
	 * A helper for taxonomies.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * A helper for post types.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type;

	/**
	 * A helper for author archives.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * The WPDB mock.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	private $wpdb;

	/**
	 * The query limit.
	 *
	 * @var int
	 */
	private $limit = 1000;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->taxonomy       = Mockery::mock( Taxonomy_Helper::class );
		$this->post_type      = Mockery::mock( Post_Type_Helper::class );
		$this->author_archive = Mockery::mock( Author_Archive_Helper::class );

		$this->instance = Mockery::mock(
			Indexable_Cleanup_Repository::class,
			[
				$this->taxonomy,
				$this->post_type,
				$this->author_archive,
			]
		)->makePartial();

		global $wpdb;

		$wpdb              = Mockery::mock( wpdb::class );
		$wpdb->prefix      = 'wp_';
		$wpdb->show_errors = false;
		$wpdb->users       = 'users';

		$this->wpdb = $wpdb;
	}

	/**
	 * Sets up expectations for the clean_indexables_with_object_type_and_object_sub_type cleanup task.
	 *
	 * @covers ::clean_indexables_with_object_type_and_object_sub_type
	 * @return void
	 */
	public function test_clean_indexables_with_object_type_and_object_sub_type_mocks() {

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d',
				'post',
				'shop_order',
				$this->limit
			)
			->andReturn( 'prepared_shop_order_delete_query' );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_shop_order_delete_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_with_object_type_and_object_sub_type( 'post', 'shop_order', $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_with_post_status cleanup task.
	 *
	 * @covers ::clean_indexables_with_post_status
	 * @return void
	 */
	public function test_clean_indexables_with_post_status_mocks() {
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE object_type = \'post\' AND post_status = %s ORDER BY id LIMIT %d',
				'auto-draft',
				$this->limit
			)
			->andReturn( 'prepared_auto_draft_delete_query' );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_auto_draft_delete_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_with_post_status( 'auto-draft', $this->limit );
	}

	/**
	 * Sets up expectations for the cleanup_orphaned_from_table cleanup task.
	 *
	 * @dataProvider data_orphaned_from_table
	 * @covers ::cleanup_orphaned_from_table
	 * @param int    $return_value The number of deleted items to return.
	 * @param string $model_name   The human-readable model name.
	 * @param string $column       The column.
	 *
	 * @return void
	 */
	public function test_cleanup_orphaned_from_table( $return_value, $model_name, $column ) {
		$table = Model::get_table_name( $model_name );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT table_to_clean.{$column}
			FROM {$table} table_to_clean
			LEFT JOIN wp_yoast_indexable AS indexable_table
			ON table_to_clean.{$column} = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.{$column} IS NOT NULL
			LIMIT %d",
				$this->limit
			)
			->andReturn( 'prepared_indexable_hierarchy_select_query' );

		$ids = \array_fill( 0, $return_value, 1 );

		$this->wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'prepared_indexable_hierarchy_select_query' )
			->andReturn( $ids );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "DELETE FROM {$table} WHERE {$column} IN( " . \implode( ',', $ids ) . ' )' )
			->andReturn( $return_value );
		$this->instance->cleanup_orphaned_from_table( $model_name, $column, $this->limit );
	}

	/**
	 * Data provider for the `test_cleanup_orphaned_from_table()` test.
	 *
	 * @return array
	 */
	public static function data_orphaned_from_table() {
		return [
			[ 50, 'Indexable_Hierarchy', 'indexable_id' ],
			[ 50, 'SEO_Links', 'indexable_id' ],
			[ 50, 'SEO_Links', 'target_indexable_id' ],
		];
	}

	/**
	 * Sets up expectations for the clean_indexables_for_non_publicly_viewable_post cleanup task.
	 *
	 * @covers ::clean_indexables_for_non_publicly_viewable_post
	 * @return void
	 */
	public function test_clean_indexables_for_non_publicly_viewable_post() {
		$this->post_type->expects( 'get_indexable_post_types' )->once()->andReturns(
			[
				'my_cpt',
				'post',
				'attachment',
			]
		);
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'post\'
				AND object_sub_type IS NOT NULL
				AND object_sub_type NOT IN ( %s, %s, %s )
				LIMIT %d',
				[ 'my_cpt', 'post', 'attachment', $this->limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_for_non_publicly_viewable_post( $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_non_publicly_viewable_taxonomies cleanup task.
	 *
	 * @covers ::clean_indexables_for_non_publicly_viewable_taxonomies
	 * @return void
	 */
	public function test_clean_indexables_for_non_publicly_viewable_taxonomies() {
		$this->taxonomy->expects( 'get_indexable_taxonomies' )->once()->andReturns(
			[
				'category',
				'post_tag',
				'my_custom_tax',
			]
		);

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'term\'
				AND object_sub_type IS NOT NULL
				AND object_sub_type NOT IN ( %s, %s, %s )
				LIMIT %d',
				[ 'category', 'post_tag', 'my_custom_tax', $this->limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_for_non_publicly_viewable_taxonomies( $this->limit );
	}

	/**
	 * Tests the clean_indexables_for_non_publicly_viewable_taxonomies cleanup task.
	 *
	 * @covers ::clean_indexables_for_non_publicly_viewable_post_type_archive_pages
	 * @return void
	 */
	public function test_clean_indexables_for_non_publicly_viewable_post_type_archives() {
		$my_cpt                  = new stdClass();
		$my_cpt->name            = 'my_cpt';
		$my_cpt->has_archive     = true;
		$post                    = new stdClass();
		$post->name              = 'post';
		$post->has_archive       = true;
		$attachment              = new stdClass();
		$attachment->name        = 'attachment';
		$attachment->has_archive = true;

		$this->post_type->expects( 'get_indexable_post_archives' )->once()->andReturns( [ $my_cpt, $post, $attachment ] );
		$this->wpdb->shouldReceive( 'prepare' )
				->once()
				->with(
					'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'post-type-archive\'
				AND object_sub_type IS NOT NULL
				AND object_sub_type NOT IN ( %s, %s, %s )
				LIMIT %d',
					[ 'my_cpt', 'post', 'attachment', $this->limit ]
				)
				->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
				->once()
				->with( 'prepared_clean_query' )
				->andReturn( 50 );

		$this->instance->clean_indexables_for_non_publicly_viewable_post_type_archive_pages( $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_authors_archive_disabled cleanup task.
	 *
	 * @covers ::clean_indexables_for_authors_archive_disabled
	 * @return void
	 */
	public function test_clean_indexables_for_authors_archive_disabled() {
		$this->author_archive->expects( 'are_disabled' )->once()->andReturnTrue();

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with( 'DELETE FROM wp_yoast_indexable WHERE object_type = \'user\' LIMIT %d', $this->limit )
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_for_authors_archive_disabled( $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_authors_without_archive cleanup task.
	 *
	 * @covers ::clean_indexables_for_authors_without_archive
	 * @return void
	 */
	public function test_clean_indexables_for_authors_without_archive() {
		$this->author_archive->expects( 'get_author_archive_post_types' )->once()->andReturns( [ 'post' ] );

		Monkey\Functions\expect( 'get_post_stati' )->once()->andReturns( [ 'publish', 'draft' ] );
		Monkey\Functions\expect( 'is_post_status_viewable' )->twice()->andReturnUsing(
			static function ( $value ) {
				return $value === 'publish';
			}
		);
		$this->wpdb->posts = 'wp_posts';

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'user\'
				AND object_id NOT IN (
					SELECT DISTINCT post_author
					FROM wp_posts
					WHERE post_type IN ( %s )
					AND post_status IN ( %s )
				) LIMIT %d',
				[ 'post', 'publish', $this->limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( 50 );

		$this->instance->clean_indexables_for_authors_without_archive( $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_authors_without_archive cleanup task.
	 *
	 * @covers ::update_indexables_author_to_reassigned
	 * @return void
	 */
	public function test_update_indexables_author_to_reassigned() {
		$this->wpdb->posts = 'wp_posts';
		$this->wpdb->users = 'wp_users';
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- This is a WordPress constant.
		\define( 'OBJECT_K', 'OBJECT_K' );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT wp_yoast_indexable.author_id, wp_posts.post_author
			FROM wp_yoast_indexable JOIN wp_posts on wp_yoast_indexable.object_id = wp_posts.id
			WHERE object_type='post'
			AND wp_yoast_indexable.author_id <> wp_posts.post_author
			ORDER BY wp_yoast_indexable.author_id
			LIMIT %d",
				$this->limit
			)
			->andReturn( 'prepared_select_query' );

		$query_return              = new stdClass();
		$query_return->author_id   = 1;
		$query_return->post_author = 2;

		$this->wpdb->shouldReceive( 'get_results' )
			->once()
			->with( 'prepared_select_query', \OBJECT_K )
			->andReturn( [ 1 => $query_return ] );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'
				UPDATE wp_yoast_indexable
				SET wp_yoast_indexable.author_id = 2
				WHERE wp_yoast_indexable.author_id = 1
				AND object_type=\'post\'
				LIMIT %d',
				$this->limit
			)
			->andReturn( 'prepared_update_query' );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_update_query' );

		$this->instance->update_indexables_author_to_reassigned( $this->limit );
	}

	/**
	 * Sets up expectations for the setup_clean_indexables_for_object_type_and_source_table cleanup task.
	 *
	 * @dataProvider data_clean_indexables_for_object_type_and_source_table
	 * @covers ::clean_indexables_for_object_type_and_source_table
	 * @param int    $return_value      The number of deleted items to return.
	 * @param string $source_table      The source table which we need to check the indexables against.
	 * @param string $source_identifier The identifier which the indexables are matched to.
	 * @param string $object_type       The indexable object type.
	 *
	 * @return void
	 */
	public function test_clean_indexables_for_object_type_and_source_table( $return_value, $source_table, $source_identifier, $object_type ) {
		$source_table_test = $this->wpdb->prefix . $source_table;
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT indexable_table.object_id
			FROM wp_yoast_indexable indexable_table
			LEFT JOIN {$source_table_test} AS source_table
			ON indexable_table.object_id = source_table.{$source_identifier}
			WHERE source_table.{$source_identifier} IS NULL
			AND indexable_table.object_id IS NOT NULL
			AND indexable_table.object_type = '{$object_type}'
			LIMIT %d",
				$this->limit
			)
			->andReturn( 'prepared_clean_query' );

		$ids = \array_fill( 0, $return_value, 1 );

		$this->wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $ids );

		if ( $return_value === 0 ) {
			return;
		}

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "DELETE FROM wp_yoast_indexable WHERE object_type = '{$object_type}' AND object_id IN( " . \implode( ',', $ids ) . ' )' )
			->andReturn( $return_value );

		$this->instance->clean_indexables_for_object_type_and_source_table( $source_table, $source_identifier, $object_type, $this->limit );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_orphaned_users cleanup task.
	 *
	 * @covers ::clean_indexables_for_orphaned_users
	 *
	 * @return void
	 */
	public function test_clean_indexables_for_orphaned_users() {
		$source_table_test = $this->wpdb->users;
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT indexable_table.object_id
			FROM wp_yoast_indexable indexable_table
			LEFT JOIN {$source_table_test} AS source_table
			ON indexable_table.object_id = source_table.ID
			WHERE source_table.ID IS NULL
			AND indexable_table.object_id IS NOT NULL
			AND indexable_table.object_type = 'user'
			LIMIT %d",
				$this->limit
			)
			->andReturn( 'prepared_clean_query' );

		$ids = \array_fill( 0, 50, 1 );

		$this->wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $ids );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "DELETE FROM wp_yoast_indexable WHERE object_type = 'user' AND object_id IN( " . \implode( ',', $ids ) . ' )' )
			->andReturn( 50 );

		$this->instance->clean_indexables_for_orphaned_users( $this->limit );
	}

	/**
	 * Tests if the count query returns data when there are indexable archives.
	 *
	 * @covers ::count_indexables_for_non_publicly_post_type_archive_pages
	 * @return void
	 */
	public function test_count_indexables_for_non_publicly_post_type_archive_pages() {
		$my_cpt                  = new stdClass();
		$my_cpt->name            = 'my_cpt';
		$my_cpt->has_archive     = true;
		$post                    = new stdClass();
		$post->name              = 'post';
		$post->has_archive       = true;
		$attachment              = new stdClass();
		$attachment->name        = 'attachment';
		$attachment->has_archive = true;

		$this->post_type->expects( 'get_indexable_post_archives' )->once()->andReturns( [ $my_cpt, $post, $attachment ] );
		$orm_object = Mockery::mock( ORM::class );

		$orm_object
			->expects()->where( 'object_type', 'post-type-archive' )
			->andReturn( $orm_object );

		$orm_object
			->expects()->where_not_equal( 'object_sub_type', 'null' )
			->andReturn( $orm_object );

		$orm_object
			->expects()->where_not_in( 'object_sub_type', [ 'my_cpt', 'post', 'attachment' ] )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'count' )
			->once()
			->andReturn( 0 );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );
		$this->instance->count_indexables_for_non_publicly_post_type_archive_pages();
	}

	/**
	 * Tests if the count query returns data when there are no indexable archives.
	 *
	 * @covers ::count_indexables_for_non_publicly_post_type_archive_pages
	 * @return void
	 */
	public function test_count_indexables_for_non_publicly_post_type_archive_pages_no_archives() {
		$my_cpt                  = new stdClass();
		$my_cpt->name            = 'my_cpt';
		$my_cpt->has_archive     = true;
		$post                    = new stdClass();
		$post->name              = 'post';
		$post->has_archive       = true;
		$attachment              = new stdClass();
		$attachment->name        = 'attachment';
		$attachment->has_archive = true;

		$this->post_type->expects( 'get_indexable_post_archives' )->once()->andReturns( [] );
		$orm_object = Mockery::mock( ORM::class );

		$orm_object
			->expects()->where( 'object_type', 'post-type-archive' )
			->andReturn( $orm_object );

		$orm_object
			->expects()->where_not_equal( 'object_sub_type', 'null' )
			->andReturn( $orm_object );

		$orm_object
			->expects()->where_not_in( 'object_sub_type', [] )->never();

		$orm_object
			->expects( 'count' )
			->once()
			->andReturn( 0 );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );
		$this->instance->count_indexables_for_non_publicly_post_type_archive_pages();
	}

	/**
	 * Data provider for the `test_cleanup_orphaned_from_table()` test.
	 *
	 * @return array
	 */
	public static function data_clean_indexables_for_object_type_and_source_table() {
		return [
			[ 50, 'posts', 'ID', 'post' ],
			[ 50, 'terms', 'term_id', 'term' ],
		];
	}
}
