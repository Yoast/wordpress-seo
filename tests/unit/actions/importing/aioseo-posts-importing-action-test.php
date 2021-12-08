<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posts_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action
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
	 * The mocked indexable_to_postmeta helper.
	 *
	 * @var Mockery\MockInterface|Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                  = Mockery::mock( 'wpdb' );
		$this->meta                  = Mockery::mock( Meta_Helper::class );
		$this->indexable_to_postmeta = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] );
		$this->options               = Mockery::mock( Options_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->replacevar_handler    = new Aioseo_Replacevar_Handler();
		$this->instance              = new Aioseo_Posts_Importing_Action( $this->indexable_repository, $this->wpdb, $this->indexable_to_postmeta, $this->options, $this->wpdb_helper, $this->replacevar_handler );
		$this->mock_instance         = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->wpdb_helper,
				$this->replacevar_handler,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$this->wpdb->prefix = 'wp_';
	}

	/**
	 * Tests the getting of unimported AIOSEO data.
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		$this->mock_instance->expects( 'set_completed' )
			->once();

		$this->mock_instance->expects( 'get_cursor' )
			->once()
			->andReturn( 1337 );

		$expected_query = 'SELECT id FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 1337, 25 ]
			)
			->andReturn(
				'
				SELECT id
				FROM wp_aioseo_posts
				WHERE id > 1337
				ORDER BY id
				LIMIT 25'
			);

		$this->mock_instance->expects( 'get_table' )
			->twice()
			->andReturn( 'wp_aioseo_posts' );

		$this->wpdb_helper->expects( 'table_exists' )
			->once()
			->andReturn( true );

		$this->wpdb->expects( 'get_col' )
			->once()
			->with(
				'
				SELECT id
				FROM wp_aioseo_posts
				WHERE id > 1337
				ORDER BY id
				LIMIT 25'
			)
			->andReturn( [ '1338', '1339', '1340' ] );

		$limited_unimported_rows = $this->mock_instance->get_limited_unindexed_count( 25 );
		$this->assertEquals( 3, $limited_unimported_rows );
	}

	/**
	 * Tests the importing of AIOSEO data.
	 *
	 * @covers ::index
	 */
	public function test_donot_index_if_no_importables() {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		define( 'ARRAY_A', 'ARRAY_A' );

		$this->mock_instance->expects( 'set_completed' )
			->once();

		$this->mock_instance->expects( 'get_cursor' )
			->once()
			->andReturn( 1337 );

		$expected_query = 'SELECT title, description, og_title, og_description, twitter_title, twitter_description, id, post_id FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 1337, 25 ]
			)
			->andReturn(
				'
				SELECT title, description, og_title, og_description, twitter_title, twitter_description, id, post_id
				FROM wp_aioseo_posts
				WHERE id > 1337
				ORDER BY id
				LIMIT 25'
			);

			$this->mock_instance->expects( 'get_table' )
				->twice()
				->andReturn( 'wp_aioseo_posts' );

			$this->wpdb_helper->expects( 'table_exists' )
				->once()
				->andReturn( true );

			// Return 0 importables.
			$this->wpdb->expects( 'get_results' )
				->once()
				->andReturn( [] );

			$this->mock_instance->expects( 'set_cursor' )
				->once()
				->with( $this->options, 'aioseo_posts', 0 );

			$this->mock_instance->index();
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
