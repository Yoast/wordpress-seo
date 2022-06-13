<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_General_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Helpers\Import_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_General_Settings_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_General_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_General_Settings_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Aioseo_General_Settings_Importing_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_General_Settings_Importing_Action
	 */
	protected $instance;

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Aioseo_General_Settings_Importing_Action_Double
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
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

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
	 * An array of the total General Settings we can import.
	 *
	 * @var array
	 */
	protected $full_settings_to_import = [
		'separator'       => '&larr;',
		'siteTitle'       => 'Site Title',
		'metaDescription' => 'Site Desc',
		'schema'          => [
			'siteRepresents'   => 'person',
			'person'           => 60,
			'organizationName' => 'Org Name',
			'organizationLogo' => 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg',
		],
	];

	/**
	 * The flattened array of the total General Settings we can import.
	 *
	 * @var array
	 */
	protected $flattened_settings_to_import = [
		'/separator'               => '&larr;',
		'/siteTitle'               => 'Site Title',
		'/metaDescription'         => 'Site Desc',
		'/schema/siteRepresents'   => 'person',
		'/schema/person'           => 60,
		'/schema/organizationName' => 'Org Name',
		'/schema/organizationLogo' => 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg',
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
		$this->image              = Mockery::mock( Image_Helper::class );
		$this->instance           = new Aioseo_General_Settings_Importing_Action( $this->import_cursor, $this->options, $this->sanitization, $this->image, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->instance->set_import_helper( $this->import_helper );

		$this->mock_instance = Mockery::mock(
			Aioseo_General_Settings_Importing_Action_Double::class,
			[ $this->import_cursor, $this->options, $this->sanitization, $this->image, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
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
		$this->assertSame( 'aioseo_options', $source_option_name );
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
			->with( 'aioseo_options', '' )
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
	 * Tests mapping AIOSEO general settings.
	 *
	 * @dataProvider provider_map
	 * @covers ::map
	 *
	 * @param string $setting         The setting at hand, eg. post or movie-category, separator etc.
	 * @param string $setting_value   The value of the AIOSEO setting at hand.
	 * @param int    $times           The times that we will import each setting, if any.
	 * @param int    $transform_times The times that we will transform each setting, if any.
	 * @param int    $image_times     The times that we will use the image helper.
	 * @param int    $set_image_times The times that we will set image data.
	 */
	public function test_map( $setting, $setting_value, $times, $transform_times, $image_times, $set_image_times ) {
		$this->mock_instance->build_mapping();
		$aioseo_options_to_yoast_map = $this->mock_instance->get_aioseo_options_to_yoast_map();

		$this->options->shouldReceive( 'get_default' )
			->times( $times )
			->andReturn( 'not_null' );

		$this->replacevar_handler->shouldReceive( 'transform' )
			->times( $transform_times )
			->with( $setting_value )
			->andReturn( $setting_value );

		$this->image->shouldReceive( 'get_attachment_by_url' )
			->times( $image_times )
			->with( $setting_value )
			->andReturn( 123 );

		$this->options->shouldReceive( 'set' )
			->times( $set_image_times );

		$this->image->shouldReceive( 'get_attachment_meta_from_settings' )
			->times( $image_times )
			->with( 'company_logo' )
			->andReturn( [ 'meta' ] );

		$this->sanitization->shouldReceive( 'sanitize_text_field' )
			->times( $transform_times )
			->with( $setting_value )
			->andReturn( $setting_value );

		$this->sanitization->shouldReceive( 'sanitize_url' )
			->times( $image_times )
			->with( $setting_value, null )
			->andReturn( $setting_value );

		$this->options->shouldReceive( 'set' )
			->times( $times );

		$this->mock_instance->map( $setting_value, $setting );
	}

	/**
	 * Tests transforming the separator settings.
	 *
	 * @dataProvider provider_transform_separator
	 * @covers ::transform_separator
	 *
	 * @param string $separator               The separator.
	 * @param string $expected_transformation The expected transformed separator.
	 */
	public function test_transform_separator( $separator, $expected_transformation ) {
		$transformed_separator = $this->mock_instance->transform_separator( $separator );

		$this->assertSame( $expected_transformation, $transformed_separator );
	}

	/**
	 * Tests transforming the site represents setting.
	 *
	 * @dataProvider provider_transform_site_represents
	 * @covers ::transform_site_represents
	 *
	 * @param string $site_represents         The site represents setting.
	 * @param string $expected_transformation The expected transformed separator.
	 */
	public function test_transform_site_represents( $site_represents, $expected_transformation ) {
		$transformed_site_represents = $this->mock_instance->transform_site_represents( $site_represents );

		$this->assertSame( $expected_transformation, $transformed_site_represents );
	}

	/**
	 * Tests returning a setting map of the robot setting for one subset of general settings.
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
	 * @param array $aioseo_settings The AIOSEO settings.
	 * @param bool  $expected_result The expected result.
	 *
	 * @dataProvider provider_isset_settings_tab
	 * @covers ::isset_settings_tab
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
				'global' => 'settings',
			],
		];

		$aioseo_settings_with_subsetting_not_set = [
			'searchAppearance' => [
				'not_global' => 'settings',
			],
		];
		return [
			[ $aioseo_settings_with_subsetting_set, true ],
			[ $aioseo_settings_with_subsetting_not_set, false ],
		];
	}

	/**
	 * Data provider for test_transform_site_represents().
	 *
	 * @return array
	 */
	public function provider_transform_site_represents() {
		return [
			[ 'person', 'person' ],
			[ 'organization', 'company' ],
			[ 'random_value', 'company' ],
		];
	}

	/**
	 * Data provider for test_transform_separator().
	 *
	 * @return array
	 */
	public function provider_transform_separator() {
		return [
			[ '&#45;', 'sc-dash' ],
			[ '&ndash;', 'sc-ndash' ],
			[ '&mdash;', 'sc-mdash' ],
			[ '&raquo;', 'sc-raquo' ],
			[ '&laquo;', 'sc-laquo' ],
			[ '&gt;', 'sc-gt' ],
			[ '&bull;', 'sc-bull' ],
			[ '&#124;', 'sc-pipe' ],
			[ 'random_separator', 'sc-dash' ],
		];
	}

	/**
	 * Data provider for test_map().
	 *
	 * @return array
	 */
	public function provider_map() {
		return [
			[ '/separator', '&larr;', 1, 0, 0, 0 ],
			[ '/siteTitle', 'Site Title', 1, 1, 0, 0 ],
			[ '/metaDescription', 'Site Desc', 1, 1, 0, 0 ],
			[ '/schema/siteRepresents', 'person', 1, 0, 0, 0 ],
			[ '/schema/person', 60, 1, 1, 0, 0 ],
			[ '/schema/organizationName', 'Org Name', 1, 1, 0, 0 ],
			[ '/schema/organizationLogo', 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg', 1, 0, 1, 3 ],
			[ '/randomSetting', 'randomeValue', 0, 0, 0, 0 ],
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
				'global'     => $this->full_settings_to_import,
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
