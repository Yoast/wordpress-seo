<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posttype_Defaults_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Helpers\Import_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posttype_Defaults_Settings_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posttype_Defaults_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posttype_Defaults_Settings_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Aioseo_Posttype_Defaults_Settings_Importing_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Posttype_Defaults_Settings_Importing_Action
	 */
	protected $instance;

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Aioseo_Posttype_Defaults_Settings_Importing_Action_Double
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
	 * An array of the total Posttype Defaults Settings we can import.
	 *
	 * @var array
	 */
	protected $full_settings_to_import = [
		'post'       => [
			'show'            => true,
			'title'           => 'Post Title',
			'metaDescription' => 'Post Desc',
			'advanced'        => [
				'robotsMeta' => [
					'default' => true,
					'noindex' => false,
				],
			],
		],
		'attachment' => [
			'show'                   => true,
			'title'                  => 'Media Title',
			'metaDescription'        => 'Media Desc',
			'advanced'               => [
				'robotsMeta' => [
					'default' => true,
					'noindex' => false,
				],
			],
			'redirectAttachmentUrls' => 'attachment_parent',
		],
		'page'       => [
			'show'            => true,
			'title'           => 'Page Title',
			'metaDescription' => 'Page Desc',
			'advanced'        => [
				'robotsMeta' => [
					'default' => false,
					'noindex' => true,
				],
			],
		],
	];

	/**
	 * The flattened array of the total Posttype Defaults we can import.
	 *
	 * @var array
	 */
	protected $flattened_settings_to_import = [
		'/post/show'                              => true,
		'/post/title'                             => 'Post Title',
		'/post/metaDescription'                   => 'Post Desc',
		'/post/advanced/robotsMeta/default'       => true,
		'/post/advanced/robotsMeta/noindex'       => false,
		'/attachment/show'                        => true,
		'/attachment/title'                       => 'Media Title',
		'/attachment/metaDescription'             => 'Media Desc',
		'/attachment/advanced/robotsMeta/default' => true,
		'/attachment/advanced/robotsMeta/noindex' => false,
		'/attachment/redirectAttachmentUrls'      => 'attachment_parent',
		'/page/show'                              => true,
		'/page/title'                             => 'Page Title',
		'/page/metaDescription'                   => 'Page Desc',
		'/page/advanced/robotsMeta/default'       => false,
		'/page/advanced/robotsMeta/noindex'       => true,
	];

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->import_cursor      = Mockery::mock( Import_Cursor_Helper::class );
		$this->options            = Mockery::mock( Options_Helper::class );
		$this->sanitization       = Mockery::mock( Sanitization_Helper::class );
		$this->replacevar_handler = Mockery::mock( Aioseo_Replacevar_Service::class );
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->import_helper      = Mockery::mock( Import_Helper::class );
		$this->instance           = new Aioseo_Posttype_Defaults_Settings_Importing_Action( $this->import_cursor, $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->instance->set_import_helper( $this->import_helper );

		$this->mock_instance = Mockery::mock(
			Aioseo_Posttype_Defaults_Settings_Importing_Action_Double::class,
			[ $this->import_cursor, $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
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
	 * Tests mapping AIOSEO Posttype Defaults settings.
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
		$posttypes = [
			(object) [
				'name' => 'post',
			],
			(object) [
				'name' => 'page',
			],
			(object) [
				'name' => 'attachment',
			],
		];
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->andReturn( $posttypes );

		$this->mock_instance->build_mapping();

		$aioseo_options_to_yoast_map = $this->mock_instance->get_aioseo_options_to_yoast_map();

		$this->options->shouldReceive( 'get_default' )
			->times( $times )
			->andReturn( 'not_null' );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->times( $transform_times )
			->with( $setting_value )
			->andReturn( $setting_value );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
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
	 * Tests transforming the redirect_attachment setting.
	 *
	 * @dataProvider provider_import_redirect_attachment
	 * @covers ::import_redirect_attachment
	 *
	 * @param string $redirect_attachment     The redirect_attachment setting.
	 * @param string $expected_transformation The expected transformed redirect_attachment setting.
	 */
	public function test_import_redirect_attachment( $redirect_attachment, $expected_transformation ) {
		$transformed_redirect_attachment = $this->mock_instance->import_redirect_attachment( $redirect_attachment );

		$this->assertSame( $expected_transformation, $transformed_redirect_attachment );
	}

	/**
	 * Tests returning a setting map of the robot setting for one subset of posttypes.
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
				'postTypes' => 'settings',
			],
		];

		$aioseo_settings_with_subsetting_not_set = [
			'searchAppearance' => [
				'not_postTypes' => 'settings',
			],
		];
		return [
			[ $aioseo_settings_with_subsetting_set, true ],
			[ $aioseo_settings_with_subsetting_not_set, false ],
		];
	}

	/**
	 * Data provider for test_import_redirect_attachment().
	 *
	 * @return array
	 */
	public function provider_import_redirect_attachment() {
		return [
			[ 'disabled', false ],
			[ 'attachment', true ],
			[ 'attachment_parent', true ],
		];
	}

	/**
	 * Data provider for test_map().
	 *
	 * @return array
	 */
	public function provider_map() {
		return [
			[ '/post/title', 'Post Title', 1, 1, 0 ],
			[ '/post/metaDescription', 'Post Desc', 1, 1, 0 ],
			[ '/post/show', true, 0, 0, 0 ],
			[ '/post/advanced/robotsMeta/noindex', true, 1, 0, 1 ],
			[ '/page/title', 'Page Title', 1, 1, 0 ],
			[ '/page/metaDescription', 'Page Desc', 1, 1, 0 ],
			[ '/page/show', true, 0, 0, 0 ],
			[ '/page/advanced/robotsMeta/noindex', true, 1, 0, 1 ],
			[ '/attachment/title', 'Media Title', 1, 1, 0 ],
			[ '/attachment/metaDescription', 'Media Desc', 1, 1, 0 ],
			[ '/attachment/show', true, 0, 0, 0 ],
			[ '/attachment/advanced/robotsMeta/noindex', true, 1, 0, 1 ],
			[ '/attachment/redirectAttachmentUrls', true, 1, 0, 0 ],
			[ '/random/key', 'random value', 0, 0, 0 ],
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
				'postTypes'   => $this->full_settings_to_import,
				'archives'    => [
					'author' => [
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
