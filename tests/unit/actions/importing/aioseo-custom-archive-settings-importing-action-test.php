<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Custom_Archive_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Helpers\Import_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Custom_Archive_Settings_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Custom_Archive_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Custom_Archive_Settings_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Aioseo_Custom_Archive_Settings_Importing_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Custom_Archive_Settings_Importing_Action
	 */
	protected $instance;

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Aioseo_Custom_Archive_Settings_Importing_Action_Double
	 */
	protected $mock_instance;

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
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * The import helper.
	 *
	 * @var Mockery\MockInterface|Import_Helper
	 */
	protected $import_helper;

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
	 * An array of the total Custom Archive Settings we can import.
	 *
	 * @var array
	 */
	protected $full_settings_to_import = [
		'book'  => [
			'show'            => true,
			'title'           => 'Book Title',
			'metaDescription' => 'Book Desc',
			'advanced'        => [
				'showDateInGooglePreview' => true,
			],
		],
		'movie' => [
			'show'            => true,
			'title'           => 'Movie Title',
			'metaDescription' => 'Movie Desc',
			'advanced'        => [
				'showDateInGooglePreview' => true,
			],
		],
	];

	/**
	 * The flattened array of the total Custom Archive Settings we can import.
	 *
	 * @var array
	 */
	protected $flattened_settings_to_import = [
		'/book/show'                              => true,
		'/book/title'                             => 'Book Title',
		'/book/metaDescription'                   => 'Book Desc',
		'/book/advanced/showDateInGooglePreview'  => true,
		'/movie/show'                             => true,
		'/movie/title'                            => 'Movie Title',
		'/movie/metaDescription'                  => 'Movie Desc',
		'/movie/advanced/showDateInGooglePreview' => true,
	];

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->import_cursor      = Mockery::mock( Import_Cursor_Helper::class );
		$this->options            = Mockery::mock( Options_Helper::class );
		$this->sanitization       = Mockery::mock( Sanitization_Helper::class );
		$this->post_type          = Mockery::mock( Post_Type_Helper::class );
		$this->replacevar_handler = Mockery::mock( Aioseo_Replacevar_Service::class );
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->import_helper      = Mockery::mock( Import_Helper::class );
		$this->instance           = new Aioseo_Custom_Archive_Settings_Importing_Action( $this->import_cursor, $this->options, $this->sanitization, $this->post_type, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->instance->set_import_helper( $this->import_helper );

		$this->mock_instance = Mockery::mock(
			Aioseo_Custom_Archive_Settings_Importing_Action_Double::class,
			[ $this->import_cursor, $this->options, $this->sanitization, $this->post_type, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
		$this->mock_instance->set_import_helper( $this->import_helper );
	}

	/**
	 * Tests the getting of the source option_name.
	 *
	 * @covers ::get_source_option_name
	 */
	public function test_get_source_option_name() {
		$source_option_name = $this->instance->get_source_option_name();
		$this->assertSame( 'aioseo_options_dynamic', $source_option_name );
	}

	/**
	 * Tests retrieving unimported AiOSEO settings.
	 *
	 * @dataProvider provider_query
	 * @covers ::query
	 *
	 * @param array $query_results        The results from the query.
	 * @param bool  $expected_unflattened The expected unflattened retrieved data.
	 * @param bool  $expected             The expected retrieved data.
	 * @param int   $times                The expected times we will look for the chunked unimported settings.
	 */
	public function test_query( $query_results, $expected_unflattened, $expected, $times ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'aioseo_options_dynamic', '' )
			->andReturn( $query_results );

		$this->import_helper->shouldReceive( 'flatten_settings' )
			->with( $expected_unflattened )
			->times( $times )
			->andReturn( $expected );

		$this->mock_instance->shouldReceive( 'get_unimported_chunk' )
			->with( $expected, null )
			->times( $times )
			->andReturn( $expected );

		$settings_to_import = $this->mock_instance->query();
		$this->assertSame( $expected, $settings_to_import );
	}

	/**
	 * Tests mapping AIOSEO custom archive settings.
	 *
	 * @dataProvider provider_map
	 * @covers ::map
	 *
	 * @param string $setting                The setting at hand, eg. post or movie-category, separator etc.
	 * @param string $setting_value          The value of the AIOSEO setting at hand.
	 * @param int    $times                  The times that we will import each setting, if any.
	 * @param int    $transform_times        The times that we will transform each setting, if any.
	 * @param int    $transform_robots_times The times that we will transform each robot setting, if any.
	 */
	public function test_map( $setting, $setting_value, $times, $transform_times, $transform_robots_times ) {
		$archives = [
			(object) [
				'name'     => 'book',
				'_builtin' => false,
			],
			(object) [
				'name'     => 'movie',
				'_builtin' => false,
			],
		];
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->andReturn( $archives );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->times( $transform_times )
			->with( $setting_value )
			->andReturn( $setting_value );

		$this->post_type->shouldReceive( 'has_archive' )
			->andReturn( true );

		$this->mock_instance->build_mapping();
		$aioseo_options_to_yoast_map = $this->mock_instance->get_aioseo_options_to_yoast_map();

		$this->options->shouldReceive( 'get_default' )
			->times( $times )
			->andReturn( 'not_null' );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->times( $transform_times )
			->with( $setting_value )
			->andReturn( $setting_value );

		if ( $transform_robots_times > 0 ) {
			$this->robots_transformer->shouldReceive( 'transform_robot_setting' )
				->times( $transform_robots_times )
				->with( 'noindex', $setting_value, $aioseo_options_to_yoast_map[ $setting ] )
				->andReturn( $setting_value );
		}

		$this->options->shouldReceive( 'set' )
			->times( $times );

		$this->mock_instance->map( $setting_value, $setting );
	}

	/**
	 * Tests returning a setting map of the robot setting for one subset of archives.
	 *
	 * @covers ::pluck_robot_setting_from_mapping
	 */
	public function test_pluck_robot_setting_from_mapping() {
		$robot_setting_from_mapping = $this->instance->pluck_robot_setting_from_mapping();
		$this->assertSame( [], $robot_setting_from_mapping );
	}

	/**
	 * Tests checking if the settings tab subsetting is set in the AIOSEO option.
	 *
	 * @dataProvider provider_isset_settings_tab
	 * @covers ::isset_settings_tab
	 *
	 * @param array $aioseo_settings The AIOSEO settings.
	 * @param bool  $expected_result The expected result.
	 */
	public function test_isset_settings_tab( $aioseo_settings, $expected_result ) {
		$isset_settings_tab = $this->instance->isset_settings_tab( $aioseo_settings );
		$this->assertSame( $expected_result, $isset_settings_tab );
	}

	/**
	 * Data provider for test_isset_settings_tab().
	 *
	 * @return array
	 */
	public function provider_isset_settings_tab() {
		$aioseo_settings_with_subsetting_set = [
			'searchAppearance' => [
				'archives' => 'settings',
			],
		];

		$aioseo_settings_with_subsetting_not_set = [
			'searchAppearance' => [
				'not_archives' => 'settings',
			],
		];
		return [
			[ $aioseo_settings_with_subsetting_set, true ],
			[ $aioseo_settings_with_subsetting_not_set, false ],
		];
	}

	/**
	 * Data provider for test_map().
	 *
	 * @return array
	 */
	public function provider_map() {
		return [
			[ '/book/title', 'Book Title', 1, 1, 0 ],
			[ '/book/metaDescription', 'Book Desc', 1, 1, 0 ],
			[ '/book/advanced/robotsMeta/noindex', true, 1, 0, 1 ],
			[ '/movie/show', 'Movie Title', 0, 0, 0 ],
			[ '/movie/metaDescription', 'Movie Title', 1, 1, 0 ],
			[ '/movie/advanced/robotsMeta/noindex', true, 1, 0, 1 ],
			[ '/randome/key', 'random value', 0, 0, 0 ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_query() {
		$full_settings = [
			'searchAppearance' => [
				'archives'   => $this->full_settings_to_import,
				'postypes'   => [
					'post' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
				'taxonomies' => [
					'category' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			],
		];

		$full_settings_expected = $this->flattened_settings_to_import;

		return [
			[ \json_encode( $full_settings ), $this->full_settings_to_import, $full_settings_expected, 1 ],
		];
	}
}
