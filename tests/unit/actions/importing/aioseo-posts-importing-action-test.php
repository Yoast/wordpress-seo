<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Social_Images_Provider_Service;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posts_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posts_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded,Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
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
	 * The mocked image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * The mocked indexable_to_postmeta helper.
	 *
	 * @var Mockery\MockInterface|Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

	/**
	 * The mocked indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Import_Cursor_Helper
	 */
	protected $import_cursor;

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
	 * @var Mockery\MockInterface|Aioseo_Replacevar_Service
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
	 * The social images provider service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Social_Images_Provider_Service
	 */
	protected $social_images_provider;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository   = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                   = Mockery::mock( 'wpdb' );
		$this->meta                   = Mockery::mock( Meta_Helper::class );
		$this->import_cursor          = Mockery::mock( Import_Cursor_Helper::class );
		$this->indexable_helper       = Mockery::mock( Indexable_Helper::class );
		$this->indexable_to_postmeta  = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] );
		$this->options                = Mockery::mock( Options_Helper::class );
		$this->image                  = Mockery::mock( Image_Helper::class );
		$this->sanitization           = Mockery::mock( Sanitization_Helper::class );
		$this->wpdb_helper            = Mockery::mock( Wpdb_Helper::class );
		$this->replacevar_handler     = Mockery::mock( Aioseo_Replacevar_Service::class );
		$this->robots_provider        = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer     = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->social_images_provider = Mockery::mock( Aioseo_Social_Images_Provider_Service::class );

		$this->instance      = new Aioseo_Posts_Importing_Action(
			$this->indexable_repository,
			$this->wpdb,
			$this->import_cursor,
			$this->indexable_helper,
			$this->indexable_to_postmeta,
			$this->options,
			$this->image,
			$this->sanitization,
			$this->wpdb_helper,
			$this->replacevar_handler,
			$this->robots_provider,
			$this->robots_transformer,
			$this->social_images_provider
		);
		$this->mock_instance = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->import_cursor,
				$this->indexable_helper,
				$this->indexable_to_postmeta,
				$this->options,
				$this->image,
				$this->sanitization,
				$this->wpdb_helper,
				$this->replacevar_handler,
				$this->robots_provider,
				$this->robots_transformer,
				$this->social_images_provider,
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

		$this->import_cursor->expects( 'get_cursor' )
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
	 * Tests that importing of AIOSEO data doesn't happen when there are no AIOSEO data or when Yoast data exist.
	 *
	 * @param array $aioseo_indexables      The AIOSEO indexables that were returned from the db.
	 * @param bool  $is_default             Whether the Yoast indexable has default values.
	 * @param int   $check_if_default_times The times we expect to check if the Yoast indexable has default values.
	 * @param int   $cursor_value           The value we expect to give to the cursor at the end of the process.
	 *
	 * @dataProvider provider_donot_map
	 * @covers ::index
	 */
	public function test_donot_map( $aioseo_indexables, $is_default, $check_if_default_times, $cursor_value ) {
		if ( ! defined( 'ARRAY_A' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
			define( 'ARRAY_A', 'ARRAY_A' );
		}
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_instance->expects( 'set_completed' )
			->once();

		$this->import_cursor->expects( 'get_cursor' )
			->once()
			->andReturn( 1337 );

		$expected_query = 'SELECT title, description, og_title, og_description, twitter_title, twitter_description, canonical_url, keyphrases, og_image_url, twitter_image_url, robots_noindex, robots_nofollow, robots_noarchive, robots_nosnippet, robots_noimageindex, id, post_id, robots_default, og_image_custom_url, og_image_type, twitter_image_custom_url, twitter_image_type, twitter_use_og FROM wp_aioseo_posts WHERE id > %d ORDER BY id LIMIT %d';

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 1337, 25 ]
			)
			->andReturn(
				'
				SELECT title, description, og_title, og_description, twitter_title, twitter_description, canonical_url, keyphrases, og_image_url, twitter_image_url, robots_noindex, robots_nofollow, robots_noarchive, robots_nosnippet, robots_noimageindex, id, post_id, robots_default, og_image_custom_url, og_image_type, twitter_image_custom_url, twitter_image_type, twitter_use_og
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

			$this->wpdb->expects( 'get_results' )
				->once()
				->andReturn( $aioseo_indexables );

			$this->indexable_repository->expects( 'find_by_id_and_type' )
				->times( $check_if_default_times )
				->andReturn( $indexable );

			$expected_check_defaults_fields = [
				'title',
				'description',
				'open_graph_title',
				'open_graph_description',
				'twitter_title',
				'twitter_description',
				'canonical',
				'primary_focus_keyword',
				'is_robots_noindex',
				'is_robots_nofollow',
				'is_robots_noarchive',
				'is_robots_nosnippet',
				'is_robots_noimageindex',
			];

			$this->indexable_helper->expects( 'check_if_default_indexable' )
				->times( $check_if_default_times )
				->with( $indexable, $expected_check_defaults_fields )
				->andReturn( $is_default );

			$this->import_cursor->expects( 'set_cursor' )
				->once()
				->with( 'aioseo_posts', $cursor_value );

			$this->mock_instance->index();
	}

	/**
	 * Data provider for test_donot_map().
	 *
	 * @return string
	 */
	public function provider_donot_map() {
		$aioseo_indexable = [
			'id'      => 123,
			'post_id' => 234,
		];

		return [
			[ [], 'irrelevant', 0, 0 ],
			[ [ $aioseo_indexable ], false, 1, 123 ],
		];
	}

	/**
	 * Tests the mapping of indexable data when we have an empty Yoast indexable.
	 *
	 * @covers ::map
	 * @covers ::url_import
	 * @covers ::keyphrase_import
	 * @covers ::social_image_url_import
	 */
	public function test_map_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id = 123;

		$aioseio_indexable = [
			'title'                    => 'title1',
			'description'              => 'description1',
			'og_title'                 => 'og_title1',
			'og_description'           => 'og_description1',
			'twitter_title'            => 'twitter_title1',
			'twitter_description'      => 'twitter_description1',
			'canonical_url'            => 'https://example.com/',
			'keyphrases'               => \json_encode(
				[
					'focus' => [
						'keyphrase' => 'key phrase',
					],
				]
			),
			'og_image_type'            => 'default',
			'twitter_image_type'       => 'auto',
			'twitter_use_og'           => false,
			'robots_default'           => true,
			'robots_nofollow'          => true,
			'robots_noarchive'         => false,
			'robots_nosnippet'         => true,
			'robots_noimageindex'      => false,
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

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->once()
			->with( $aioseio_indexable['canonical_url'], null )
			->andReturn( $aioseio_indexable['canonical_url'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->once()
			->with( 'key phrase' )
			->andReturn( 'key phrase' );

		$this->social_images_provider->shouldReceive( 'get_default_social_image_source' )
			->once()
			->with( 'og' )
			->andReturn( 'attach' );

		$this->social_images_provider->shouldReceive( 'get_first_attached_image' )
			->once()
			->with( 123 )
			->andReturn( 'https://example.com/image1.png' );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->once()
			->with( 'https://example.com/image1.png', null )
			->andReturn( 'https://example.com/image1.png' );

		$this->social_images_provider->shouldReceive( 'get_auto_image' )
			->once()
			->with( 123 )
			->andReturn( 'https://example.com/image2.png' );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->once()
			->with( 'https://example.com/image2.png', null )
			->andReturn( 'https://example.com/image2.png' );

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$this->image->shouldReceive( 'get_attachment_by_url' )
			->once()
			->with( 'https://example.com/image1.png' )
			->andReturn( '123' );

		$this->image->shouldReceive( 'get_attachment_by_url' )
			->once()
			->with( 'https://example.com/image2.png' )
			->andReturn( '234' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertSame( 'title1', $indexable->title );
		$this->assertSame( 'description1', $indexable->description );
		$this->assertSame( 'og_title1', $indexable->open_graph_title );
		$this->assertSame( 'og_description1', $indexable->open_graph_description );
		$this->assertSame( 'twitter_title1', $indexable->twitter_title );
		$this->assertSame( 'twitter_description1', $indexable->twitter_description );
		$this->assertSame( 'https://example.com/', $indexable->canonical );
		$this->assertSame( 'key phrase', $indexable->primary_focus_keyword );
		$this->assertSame( 'https://example.com/image1.png', $indexable->open_graph_image );
		$this->assertSame( 'imported', $indexable->open_graph_image_source );
		$this->assertSame( '123', $indexable->open_graph_image_id );
		$this->assertSame( null, $indexable->open_graph_image_meta );
		$this->assertSame( 'https://example.com/image2.png', $indexable->twitter_image );
		$this->assertSame( 'imported', $indexable->twitter_image_source );
		$this->assertSame( '234', $indexable->twitter_image_id );
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
	 * @covers ::url_import
	 * @covers ::keyphrase_import
	 */
	public function test_map_with_existing_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id   = 123;
		$indexable->title       = 'existing_title';
		$indexable->description = 'existing_dsc';

		$aioseio_indexable = [
			'title'               => 'title1',
			'description'         => 'description1',
			'og_title'            => 'og_title1',
			'og_description'      => 'og_description1',
			'twitter_title'       => 'twitter_title1',
			'twitter_description' => 'twitter_description1',
			'canonical_url'       => 'https://example.com/',
			'keyphrases'          => \json_encode(
				[
					'focus' => [
						'not_keyphrase' => 'key phrase',
					],
				]
			),
			'og_image_type'       => 'attach',
			'twitter_image_type'  => 'auto',
			'twitter_use_og'      => true,
			'robots_default'      => true,
			'robots_nofollow'     => true,
			'robots_noarchive'    => false,
			'robots_nosnippet'    => true,
			'robots_noimageindex' => false,
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
			->twice()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->twice()
			->with( $aioseio_indexable['og_title'] )
			->andReturn( $aioseio_indexable['og_title'] );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->twice()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->twice()
			->with( $aioseio_indexable['og_description'] )
			->andReturn( $aioseio_indexable['og_description'] );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->once()
			->with( $aioseio_indexable['canonical_url'], null )
			->andReturn( $aioseio_indexable['canonical_url'] );

		$this->social_images_provider->shouldReceive( 'get_first_attached_image' )
			->twice()
			->with( 123 )
			->andReturn( 'https://example.com/image3.png' );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->twice()
			->with( 'https://example.com/image3.png', null )
			->andReturn( 'https://example.com/image3.png' );

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$this->image->shouldReceive( 'get_attachment_by_url' )
			->twice()
			->with( 'https://example.com/image3.png' )
			->andReturn( '123' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertSame( 'title1', $indexable->title );
		$this->assertSame( 'description1', $indexable->description );
		$this->assertSame( 'og_title1', $indexable->open_graph_title );
		$this->assertSame( 'og_description1', $indexable->open_graph_description );
		$this->assertSame( 'og_title1', $indexable->twitter_title );
		$this->assertSame( 'og_description1', $indexable->twitter_description );
		$this->assertSame( 'https://example.com/', $indexable->canonical );
		$this->assertSame( null, $indexable->primary_focus_keyword );
		$this->assertSame( 'https://example.com/image3.png', $indexable->open_graph_image );
		$this->assertSame( 'imported', $indexable->open_graph_image_source );
		$this->assertSame( '123', $indexable->open_graph_image_id );
		$this->assertSame( null, $indexable->open_graph_image_meta );
		$this->assertSame( 'https://example.com/image3.png', $indexable->twitter_image );
		$this->assertSame( 'imported', $indexable->twitter_image_source );
		$this->assertSame( '123', $indexable->twitter_image_id );
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
			'og_title'             => '',
			'og_description'       => '',
			'robots_default'       => true,
			'robots_default'       => true,
			'robots_nofollow'      => true,
			'robots_noarchive'     => false,
			'robots_nosnippet'     => true,
			'robots_noimageindex'  => false,
			'og_image_type'        => 'author',
			'twitter_use_og'       => true,
		];

		$this->replacevar_handler->shouldReceive( 'transform' )
			->never();

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->never();

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->never();

		$this->image->shouldReceive( 'get_attachment_by_url' )
			->never();

		$this->robots_provider->shouldReceive( 'get_subtype_robot_setting' )
			->andReturn( 'robot_setting' );

		$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
			->andReturn( 'robot_value' );

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertNull( $indexable->twitter_description );
	}

	/**
	 * Tests importing the og and twitter image url.
	 *
	 * @param bool   $aioseo_social_image_settings AIOSEO's set of social image settings for the post.
	 * @param array  $mapping                     The mapping of the setting we're working with.
	 * @param int    $expected_url                The URL that's expected to be imported.
	 * @param int    $sanitize_url_times          The times we're sanitizing the retrieved url.
	 * @param string $provider_method             The method we're using from the social images provider.
	 * @param int    $provider_times              The times we're using the social images provider.
	 * @param int    $get_default_times           The times we're getting the default url.
	 * @param string $social_setting              The social settings we use to get the default url.
	 *
	 * @dataProvider provider_social_image_url_import
	 * @covers ::social_image_url_import
	 */
	public function test_social_image_url_import( $aioseo_social_image_settings, $mapping, $expected_url, $sanitize_url_times, $provider_method, $provider_times, $get_default_times, $social_setting ) {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id = 123;

		$this->social_images_provider->shouldReceive( $provider_method )
			->times( $provider_times )
			->with( 123 )
			->andReturn( $expected_url );

		$this->social_images_provider->shouldReceive( 'get_default_custom_social_image' )
			->times( $get_default_times )
			->with( $social_setting )
			->andReturn( $expected_url );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->times( $sanitize_url_times )
			->with( $expected_url, null )
			->andReturn( $expected_url );

		$image_url = $this->instance->social_image_url_import( $aioseo_social_image_settings, 'not_used', $mapping, $indexable );

		$this->assertSame( $expected_url, $image_url );
	}

	/**
	 * Data provider for test_transform_separator().
	 *
	 * @return array
	 */
	public function provider_social_image_url_import() {
		$open_graph_mapping = [
			'yoast_name'                   => 'open_graph_image',
			'social_image_import'          => true,
			'social_setting_prefix_aioseo' => 'og_',
			'social_setting_prefix_yoast'  => 'open_graph_',
			'transform_method'             => 'social_image_url_import',
		];
		$twitter_mapping    = [
			'yoast_name'                   => 'twitter_image',
			'social_image_import'          => true,
			'social_setting_prefix_aioseo' => 'twitter_',
			'social_setting_prefix_yoast'  => 'twitter_',
			'transform_method'             => 'social_image_url_import',
		];

		$image = 'https://example.com/image.png';

		$aioseo_og_custom_image = [
			'og_image_type'       => 'custom_image',
			'og_image_custom_url' => $image,
		];
		$aioseo_og_attach       = [
			'og_image_type'       => 'attach',
		];
		$aioseo_og_author       = [
			'og_image_type'       => 'author',
		];
		$aioseo_og_auto         = [
			'og_image_type'       => 'auto',
		];
		$aioseo_og_content      = [
			'og_image_type'       => 'content',
		];
		$aioseo_og_custom       = [
			'og_image_type'       => 'custom',
		];
		$aioseo_og_featured     = [
			'og_image_type'       => 'featured',
		];

		$aioseo_twitter_custom_image = [
			'twitter_use_og'           => false,
			'twitter_image_type'       => 'custom_image',
			'twitter_image_custom_url' => $image,
		];
		$aioseo_twitter_attach       = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'attach',
		];
		$aioseo_twitter_author       = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'author',
		];
		$aioseo_twitter_auto         = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'auto',
		];
		$aioseo_twitter_content      = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'content',
		];
		$aioseo_twitter_custom       = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'custom',
		];
		$aioseo_twitter_featured     = [
			'twitter_use_og'      => false,
			'twitter_image_type'  => 'featured',
		];
		$aioseo_twitter_from_og      = [
			'twitter_use_og'      => true,
			'twitter_image_type'  => 'irrelevant',
			'og_image_type'       => 'custom_image',
			'og_image_custom_url' => $image,
		];

		return [
			[ $aioseo_og_custom_image, $open_graph_mapping, $image, 1, 'irrelevant', 0, 0, 'og' ],
			[ $aioseo_og_attach, $open_graph_mapping, $image, 1, 'get_first_attached_image', 1, 0, 'og' ],
			[ $aioseo_og_author, $open_graph_mapping, null, 0, 'irrelevant', 0, 0, 'og' ],
			[ $aioseo_og_auto, $open_graph_mapping, $image, 1, 'get_auto_image', 1, 0, 'og' ],
			[ $aioseo_og_content, $open_graph_mapping, $image, 1, 'get_first_image_in_content', 1, 0, 'og' ],
			[ $aioseo_og_custom, $open_graph_mapping, null, 0, 'irrelevant', 0, 0, 'og' ],
			[ $aioseo_og_featured, $open_graph_mapping, $image, 1, 'get_featured_image', 1, 0, 'og' ],
			[ $aioseo_twitter_custom_image, $twitter_mapping, $image, 1, 'irrelevant', 0, 0, 'twitter' ],
			[ $aioseo_twitter_attach, $twitter_mapping, $image, 1, 'get_first_attached_image', 1, 0, 'twitter' ],
			[ $aioseo_twitter_author, $twitter_mapping, null, 0, 'irrelevant', 0, 0, 'twitter' ],
			[ $aioseo_twitter_auto, $twitter_mapping, $image, 1, 'get_auto_image', 1, 0, 'twitter' ],
			[ $aioseo_twitter_content, $twitter_mapping, $image, 1, 'get_first_image_in_content', 1, 0, 'twitter' ],
			[ $aioseo_twitter_custom, $twitter_mapping, null, 0, 'irrelevant', 0, 0, 'twitter' ],
			[ $aioseo_twitter_featured, $twitter_mapping, $image, 1, 'get_featured_image', 1, 0, 'twitter' ],
			[ $aioseo_twitter_from_og, $twitter_mapping, $image, 1, 'irrelevant', 0, 0, 'og' ],
		];
	}
}
