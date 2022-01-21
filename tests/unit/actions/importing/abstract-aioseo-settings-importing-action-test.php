<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Exception;
use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Aioseo_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Abstract_Aioseo_Settings_Importing_Action_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Abstract_Aioseo_Settings_Importing_Action_Double
	 */
	protected $mock_instance;

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
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
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

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->sanitization       = Mockery::mock( Sanitization_Helper::class );
		$this->replacevar_handler = new Aioseo_Replacevar_Handler();
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->mock_instance      = Mockery::mock(
			Abstract_Aioseo_Settings_Importing_Action_Double::class,
			[ $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the getting of the source option_name.
	 *
	 * @covers ::get_source_option_name
	 */
	public function test_get_source_option_name() {
		$this->expectException( Exception::class );

		$this->mock_instance->get_source_option_name();
	}

	/**
	 * Tests the getting of the total number of unimported objects.
	 *
	 * @param array $query_results            The results from the query.
	 * @param bool  $expected_finished        Whether the importing action is finished or not.
	 * @param int   $expected_unindexed_count The count of the total unindexed data.
	 *
	 * @dataProvider provider_get_total_unindexed
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed( $query_results, $expected_finished, $expected_unindexed_count ) {
		$this->mock_instance->expects( 'query' )
			->once()
			->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		$unindexed_count = $this->mock_instance->get_total_unindexed();
		$this->assertSame( $expected_unindexed_count, $unindexed_count );
	}

	/**
	 * Tests the getting of the limited number of unimported objects.
	 *
	 * @param array $query_results            The results from the query.
	 * @param bool  $expected_finished        Whether the importing action is finished or not.
	 * @param int   $expected_unindexed_count The limited count of the unindexed data.
	 *
	 * @dataProvider provider_get_limited_unindexed
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get_limited_unindexed_count( $query_results, $expected_finished, $expected_unindexed_count ) {
		$this->mock_instance->expects( 'query' )
			->once()
			->with( 1 )
			->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		$unindexed_count = $this->mock_instance->get_limited_unindexed_count( 1 );
		$this->assertSame( $expected_unindexed_count, $unindexed_count );
	}

	/**
	 * Tests importing AIOSEO settings.
	 *
	 * @param array $query_results             The results from the query.
	 * @param bool  $expected_finished         Whether the importing action is expected to be finished or not.
	 * @param array $expected_created_settings The created settings that are expected to be returned.
	 *
	 * @dataProvider provider_index
	 * @covers ::index
	 */
	public function test_index( $query_results, $expected_finished, $expected_created_settings ) {
		$this->mock_instance->expects( 'get_limit' )
			->once()
			->andReturn( 25 );

		$this->mock_instance->expects( 'query' )
				->once()
				->with( 25 )
				->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		$this->mock_instance->expects( 'build_mapping' )
			->once();

		if ( ! $expected_finished ) {
			$this->mock_instance->expects( 'map' )
				->times( \count( $expected_created_settings ) );
		}

		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'cursor_id' );

		end( $query_results );
		$last_key = key( $query_results );
		reset( $query_results );

		$this->mock_instance->expects( 'set_cursor' )
			->once()
			->with( $this->options, 'cursor_id', $last_key );

		$created_settings = $this->mock_instance->index();
		$this->assertSame( $expected_created_settings, $created_settings );
	}

	/**
	 * Tests the getting of the chunk of the unimported data.
	 *
	 * @param array  $importable_data All of the available AIOSEO settings.
	 * @param int    $limit           The maximum number of unimported objects to be returned.
	 * @param string $cursor          The current cursor indicating where the import has been left off.
	 * @param array  $expected        The expected result.
	 *
	 * @dataProvider provider_get_unimported_chunk
	 * @covers ::get_unimported_chunk
	 */
	public function test_get_unimported_chunk( $importable_data, $limit, $cursor, $expected ) {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'chunk_id' );

		$this->mock_instance->expects( 'get_cursor' )
			->once()
			->with( $this->options, 'chunk_id', '' )
			->andReturn( $cursor );

		$this->mock_instance->expects( 'get_type' )
			->once()
			->andReturn( 'type' );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_aioseo_type_import_cursor', $cursor )
			->andReturn( $cursor );

		$unimported_chunk = $this->mock_instance->get_unimported_chunk( $importable_data, $limit );
		$this->assertSame( $expected, $unimported_chunk );
	}

	/**
	 * Tests importing a single AIOSEO setting.
	 *
	 * @param string $setting         The name of the setting.
	 * @param string $setting_value   The values of the setting.
	 * @param array  $setting_mapping The mapping of the setting to Yoast formats.
	 *
	 * @dataProvider provider_import_single_setting
	 * @covers ::import_single_setting
	 */
	public function test_import_single_setting( $setting, $setting_value, $setting_mapping ) {
		$this->options->expects( 'get_default' )
			->once()
			->with( 'wpseo_titles', $setting_mapping['yoast_name'] )
			->andReturn( 'not_null' );

		$this->mock_instance->expects( $setting_mapping['transform_method'] )
			->once()
			->with( $setting_value, $setting_mapping )
			->andReturn( 'some_value' );

		$this->options->expects( 'set' )
			->once()
			->with( $setting_mapping['yoast_name'], 'some_value' );

		$this->mock_instance->import_single_setting( $setting, $setting_value, $setting_mapping );
	}

	/**
	 * Data provider for test_import_single_setting().
	 *
	 * @return array
	 */
	public function provider_import_single_setting() {
		return [
			[
				'/separator',
				'&larr;',
				[
					'yoast_name'       => 'separator',
					'transform_method' => 'simple_import',
				],
			],
			[
				'/taxonomy/title',
				'Taxonomy Title',
				[
					'yoast_name'       => 'title-tax-taxonomy',
					'transform_method' => 'simple_import',
				],
			],
		];
	}

	/**
	 * Data provider for test_get_total_unindexed().
	 *
	 * @return array
	 */
	public function provider_get_total_unindexed() {
		return [
			[ [], true, 0 ],
			[ [ 0 ], false, 1 ],
			[ [ 0, 1, 2, 3, 4 ], false, 5 ],
		];
	}

	/**
	 * Data provider for test_get_limited_unindexed_count().
	 *
	 * @return array
	 */
	public function provider_get_limited_unindexed() {
		return [
			[ [], true, 0 ],
			[ [ 0 ], false, 1 ],
			[ [ 54321 ], false, 1 ],
		];
	}

	/**
	 * Data provider for test_index().
	 *
	 * @return array
	 */
	public function provider_index() {
		return [
			[ [], true, [] ],
			[
				[
					'/setting1' => 'value1',
				],
				false,
				[ '/setting1' ],
			],
			[
				[
					'/setting1'            => 'value1',
					'/setting2/setting2-1' => 'value2-1',
					'/setting2/setting2-2' => 'value2-2',
					'/setting2/setting2-3' => 'value2-2',
				],
				false,
				[
					'/setting1',
					'/setting2/setting2-1',
					'/setting2/setting2-2',
					'/setting2/setting2-3',
				],
			],
		];
	}

	/**
	 * Data provider for test_get_unimported_chunk().
	 *
	 * @return array
	 */
	public function provider_get_unimported_chunk() {
		$aioseo_settings = [
			'post'       => [
				'title'           => 'title1',
				'metaDescription' => 'desc1',
			],
			'page'       => [
				'title'           => 'title2',
				'metaDescription' => 'desc2',
			],
			'attachment' => [
				'title'                  => 'title3',
				'metaDescription'        => 'desc3',
				'redirectAttachmentUrls' => false,
			],
		];

		return [
			[ [], 25, '', [] ], // No settings.
			[
				$aioseo_settings,
				25,
				'',
				[
					'attachment' => [
						'title'                  => 'title3',
						'metaDescription'        => 'desc3',
						'redirectAttachmentUrls' => false,
					],
					'page'       => [
						'title'           => 'title2',
						'metaDescription' => 'desc2',
					],
					'post'       => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			], // No imported data yet, chunk big enough to return all of the settings.
			[
				$aioseo_settings,
				2,
				'',
				[
					'attachment' => [
						'title'                  => 'title3',
						'metaDescription'        => 'desc3',
						'redirectAttachmentUrls' => false,
					],
					'page'       => [
						'title'           => 'title2',
						'metaDescription' => 'desc2',
					],
				],
			], // No imported data yet, chunk small enough to return part of the settings.
			[
				$aioseo_settings,
				1,
				'page',
				[
					'post' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			], // Already imported data from before, chunk small enough to return part of the yet unimported settings.
			[
				$aioseo_settings,
				25,
				'attachment',
				[
					'page' => [
						'title'           => 'title2',
						'metaDescription' => 'desc2',
					],
					'post' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			], // Already imported data from before, chunk big enough to return all of the rest of the yet unimported settings.
			[
				$aioseo_settings,
				25,
				'attachment_misspelled',
				[
					'attachment' => [
						'title'                  => 'title3',
						'metaDescription'        => 'desc3',
						'redirectAttachmentUrls' => false,
					],
					'page'       => [
						'title'           => 'title2',
						'metaDescription' => 'desc2',
					],
					'post'       => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			], // Already imported data from before, but cursor not found so we have to start over.
			[
				$aioseo_settings,
				null,
				'',
				[
					'attachment' => [
						'title'                  => 'title3',
						'metaDescription'        => 'desc3',
						'redirectAttachmentUrls' => false,
					],
					'page'       => [
						'title'           => 'title2',
						'metaDescription' => 'desc2',
					],
					'post'       => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			], // No imported data yet, chunk size is null, so we get the whole settings.
		];
	}
}
