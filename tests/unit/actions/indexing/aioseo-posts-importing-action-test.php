<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Indexing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Aioseo_Posts_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Importing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Aioseo_Posts_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Importing_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Posts_Importing_Action
	 */
	protected $instance;

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Aioseo_Posts_Importing_Action_Double
	 */
	protected $mock_instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|\wpdb
	 */
	protected $wpdb;

	/**
	 * The mocked meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                 = Mockery::mock( 'wpdb' );
		$this->meta                 = Mockery::mock( Meta_Helper::class );
		$this->options              = Mockery::mock( Options_Helper::class );
		$this->instance             = new Aioseo_Posts_Importing_Action( $this->indexable_repository, $this->wpdb, $this->meta, $this->options );
		$this->mock_instance        = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->meta,
				$this->options,
			]
		)->makePartial();

		$this->wpdb->prefix = 'wp_';
	}

	/**
	 * Tests the getting of unimported AIOSEO data.
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		$this->mock_instance->expects( 'get_cursor' )
			->once()
			->andReturn( 0 );

		$expected_query = 'SELECT * FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 0, 25 ]
			)
			->andReturn(
				'
				SELECT *
				FROM wp_aioseo_posts
				WHERE id > 0
				ORDER BY id
				LIMIT 25'
			);

		$this->wpdb->expects( 'get_col' )
			->once()
			->with(
				'
				SELECT *
				FROM wp_aioseo_posts
				WHERE id > 0
				ORDER BY id
				LIMIT 25'
			)
			->andReturn( [ '1', '2', '3' ] );

		$limited_unimported_rows = $this->mock_instance->get_limited_unindexed_count( 25 );
		$this->assertEquals( 3, $limited_unimported_rows );
	}

	/**
	 * Tests the importing of AIOSEO data.
	 *
	 * @covers ::index
	 */
	public function test_index() {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		define( 'ARRAY_A', 'ARRAY_A' );

		$this->mock_instance->expects( 'get_cursor' )
			->once()
			->andReturn( 0 );

		$expected_query = 'SELECT * FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 0, 25 ]
			)
			->andReturn(
				'
				SELECT *
				FROM wp_aioseo_posts
				WHERE id > 0
				ORDER BY id
				LIMIT 25'
			);

			$this->wpdb->expects( 'get_results' )
				->once()
				->andReturn( [] );

			$this->mock_instance->expects( 'set_cursor' )
				->once()
				->with( $this->options, 0 );

			$this->mock_instance->index();
	}

	/**
	 * Tests the mapping of indexable data to postmeta.
	 *
	 * @covers ::map_to_postmeta
	 */
	public function test_map_postmeta_with_full_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->title                  = 'title1';
		$indexable->description            = 'description1';
		$indexable->open_graph_title       = 'open_graph_title1';
		$indexable->open_graph_description = 'open_graph_description1';
		$indexable->twitter_title          = 'twitter_title1';
		$indexable->twitter_description    = 'twitter_description1';
		$indexable->object_id              = 123;

		$this->meta->expects( 'set_value' )
			->with( 'title', 'title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'metadesc', 'description1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-title', 'open_graph_title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-description', 'open_graph_description1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'twitter-title', 'twitter_title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'twitter-description', 'twitter_description1', 123 )
			->andReturn( true );


		$this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests the mapping of indexable data to postmeta, when the indexable is empty.
	 *
	 * @covers ::map_to_postmeta
	 */
	public function test_map_postmeta_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id = 123;

		$this->meta->expects( 'set_value' )
			->never();

		$this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests the mapping of indexable data when we have an empty Yoast indexable.
	 *
	 * @covers ::map
	 */
	public function test_map_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$aioseio_indexable = [
			'title'                => 'title1',
			'description'          => 'description1',
			'og_title'             => 'og_title1',
			'og_description'       => 'og_description1',
			'twitter_title'        => 'twitter_title1',
			'twitter_description'  => 'twitter_description1',
		];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertEquals( 'title1', $indexable->title );
		$this->assertEquals( 'description1', $indexable->description );
		$this->assertEquals( 'og_title1', $indexable->open_graph_title );
		$this->assertEquals( 'og_description1', $indexable->open_graph_description );
		$this->assertEquals( 'twitter_title1', $indexable->twitter_title );
		$this->assertEquals( 'twitter_description1', $indexable->twitter_description );
	}

	/**
	 * Tests the mapping of indexable data when we have existing data in the Yoast indexable.
	 *
	 * @covers ::map
	 */
	public function test_map_with_existing_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->title       = 'existing_title';
		$indexable->description = 'existing_dsc';

		$aioseio_indexable = [
			'title'                => 'title1',
			'description'          => 'description1',
			'og_title'             => 'og_title1',
			'og_description'       => 'og_description1',
			'twitter_title'        => 'twitter_title1',
			'twitter_description'  => 'twitter_description1',
		];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertEquals( 'existing_title', $indexable->title );
		$this->assertEquals( 'existing_dsc', $indexable->description );
		$this->assertEquals( 'og_title1', $indexable->open_graph_title );
		$this->assertEquals( 'og_description1', $indexable->open_graph_description );
		$this->assertEquals( 'twitter_title1', $indexable->twitter_title );
		$this->assertEquals( 'twitter_description1', $indexable->twitter_description );
	}

	/**
	 * Tests the mapping of indexable data when we have missing data from the AIOSEO indexable.
	 *
	 * @covers ::map
	 */
	public function test_map_with_missing_aioseo_data() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->twitter_description = null;

		$aioseio_indexable = [];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertNull( $indexable->twitter_description );
	}
}
