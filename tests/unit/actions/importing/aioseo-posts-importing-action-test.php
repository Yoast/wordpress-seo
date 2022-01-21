<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
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
	 * The sanitization helper.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	protected $sanitization;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * The replacevar handler.
	 *
	 * @var Mockery\MockInterface|Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * The robots provider service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The robots transformer service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Transformer_Service
	 */
	protected $robots_transformer;

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
		$this->sanitization          = Mockery::mock( Sanitization_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->replacevar_handler    = Mockery::mock( Aioseo_Replacevar_Handler::class );
		$this->robots_provider       = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer    = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->instance              = new Aioseo_Posts_Importing_Action( $this->indexable_repository, $this->wpdb, $this->indexable_to_postmeta, $this->options, $this->sanitization, $this->wpdb_helper, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->mock_instance         = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->sanitization,
				$this->wpdb_helper,
				$this->replacevar_handler,
				$this->robots_provider,
				$this->robots_transformer,
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
		$this->assertSame( 3, $limited_unimported_rows );
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

		$expected_query = 'SELECT title, description, og_title, og_description, twitter_title, twitter_description, robots_noindex, robots_nofollow, robots_noarchive, robots_nosnippet, robots_noimageindex, id, post_id, robots_default FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

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
			'robots_default'       => true,
			'robots_nofollow'      => true,
			'robots_noarchive'     => false,
			'robots_nosnippet'     => true,
			'robots_noimageindex'  => false,
		];

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['title'] )
			->andReturn( $aioseio_indexable['title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['title'] )
			->andReturn( $aioseio_indexable['title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['description'] )
			->andReturn( $aioseio_indexable['description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['description'] )
			->andReturn( $aioseio_indexable['description'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['twitter_title'] )
			->andReturn( $aioseio_indexable['twitter_title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['twitter_title'] )
			->andReturn( $aioseio_indexable['twitter_title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['twitter_description'] )
			->andReturn( $aioseio_indexable['twitter_description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['twitter_description'] )
			->andReturn( $aioseio_indexable['twitter_description'] );

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertSame( 'title1', $indexable->title );
		$this->assertSame( 'description1', $indexable->description );
		$this->assertSame( 'og_title1', $indexable->open_graph_title );
		$this->assertSame( 'og_description1', $indexable->open_graph_description );
		$this->assertSame( 'twitter_title1', $indexable->twitter_title );
		$this->assertSame( 'twitter_description1', $indexable->twitter_description );
		$this->assertSame( null, $indexable->is_robots_noindex );
		$this->assertSame( 'robot_value', $indexable->is_robots_nofollow );
		$this->assertSame( 'robot_value', $indexable->is_robots_noarchive );
		$this->assertSame( 'robot_value', $indexable->is_robots_nosnippet );
		$this->assertSame( 'robot_value', $indexable->is_robots_noimageindex );
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
			'robots_default'       => true,
			'robots_nofollow'      => true,
			'robots_noarchive'     => false,
			'robots_nosnippet'     => true,
			'robots_noimageindex'  => false,
		];

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['twitter_title'] )
			->andReturn( $aioseio_indexable['twitter_title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['twitter_title'] )
			->andReturn( $aioseio_indexable['twitter_title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->once()
			->with( $aioseio_indexable['twitter_description'] )
			->andReturn( $aioseio_indexable['twitter_description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( $aioseio_indexable['twitter_description'] )
			->andReturn( $aioseio_indexable['twitter_description'] );

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertSame( 'existing_title', $indexable->title );
		$this->assertSame( 'existing_dsc', $indexable->description );
		$this->assertSame( 'og_title1', $indexable->open_graph_title );
		$this->assertSame( 'og_description1', $indexable->open_graph_description );
		$this->assertSame( 'twitter_title1', $indexable->twitter_title );
		$this->assertSame( 'twitter_description1', $indexable->twitter_description );
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

		$aioseio_indexable = [
			'robots_default'       => true,
			'robots_nofollow'      => true,
			'robots_noarchive'     => false,
			'robots_nosnippet'     => true,
			'robots_noimageindex'  => false,
		];

		$this->replacevar_handler->shouldReceive( 'transform' )
			->never();

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->never();

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertNull( $indexable->twitter_description );
	}
}
