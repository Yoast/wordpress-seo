<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Aioseo_General_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_General_Settings_Importing_Action_Double;

/**
 * Aioseo_General_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo_General_Settings_Importing_Action
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
	 * The sanitization helper.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	protected $sanitization;

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

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->sanitization       = Mockery::mock( Sanitization_Helper::class );
		$this->replacevar_handler = Mockery::mock( Aioseo_Replacevar_Handler::class );
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->instance           = new Aioseo_General_Settings_Importing_Action( $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->mock_instance      = Mockery::mock(
			Aioseo_General_Settings_Importing_Action_Double::class,
			[ $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
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
	 * @param array $query_results The results from the query.
	 * @param bool  $expected      The expected retrieved data.
	 *
	 * @dataProvider provider_query
	 * @covers ::query
	 */
	public function test_query( $query_results, $expected ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->andReturn( $query_results );

		$this->mock_instance->shouldReceive( 'get_unimported_chunk' )
			->with( $expected, null )
			->zeroOrMoreTimes()
			->andReturn( $expected );

		$settings_to_import = $this->mock_instance->query();
		$this->assertSame( $expected, $settings_to_import );
	}

	/**
	 * Tests flattening AIOSEO general settings.
	 *
	 * @covers ::flatten_settings
	 */
	public function test_flatten_settings() {
		$flattened_sesttings = $this->mock_instance->flatten_settings( $this->full_settings_to_import );
		$expected_result     = $this->flattened_settings_to_import;

		$this->assertSame( $expected_result, $flattened_sesttings );
	}

	/**
	 * Tests mapping AIOSEO general settings.
	 *
	 * @param string $setting         The setting at hand, eg. post or movie-category, separator etc.
	 * @param string $setting_value   The value of the AIOSEO setting at hand.
	 * @param int    $times           The times that we will import each setting, if any.
	 * @param int    $transform_times The times that we will transform each setting, if any.
	 *
	 * @dataProvider provider_map
	 * @covers ::map
	 */
	public function test_map( $setting, $setting_value, $times, $transform_times ) {
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

		$this->options->shouldReceive( 'set' )
			->times( $times );

		$this->mock_instance->map( $setting_value, $setting );
	}

	/**
	 * Tests transforming the separator settings.
	 *
	 * @param string $separator               The separator.
	 * @param string $expected_transformation The expected transformed separator.
	 *
	 * @dataProvider provider_transform_separator
	 * @covers ::transform_separator
	 */
	public function test_transform_separator( $separator, $expected_transformation ) {
		$transformed_separator = $this->mock_instance->transform_separator( $separator );

		$this->assertSame( $expected_transformation, $transformed_separator );
	}

	/**
	 * Tests transforming the site represents setting.
	 *
	 * @param string $site_represents         The site represents setting.
	 * @param string $expected_transformation The expected transformed separator.
	 *
	 * @dataProvider provider_transform_site_represents
	 * @covers ::transform_site_represents
	 */
	public function test_transform_site_represents( $site_represents, $expected_transformation ) {
		$transformed_site_represents = $this->mock_instance->transform_site_represents( $site_represents );

		$this->assertSame( $expected_transformation, $transformed_site_represents );
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
			[ '/separator', '&larr;', 1, 0 ],
			[ '/siteTitle', 'Site Title', 1, 1 ],
			[ '/metaDescription', 'Site Desc', 1, 1 ],
			[ '/schema/siteRepresents', 'person', 1, 0 ],
			[ '/schema/person', 60, 1, 1 ],
			[ '/schema/organizationName', 'Org Name', 1, 1 ],
			[ '/schema/organizationLogo', 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg', 1, 1 ],
			[ '/randomSetting', 'randomeValue', 0, 0 ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return string
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

		$missing_settings = [
			'searchAppearance' => [
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

		$missing_settings_expected = [];

		$malformed_settings = [
			'searchAppearance' => [
				'global'     => 'not_array',
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

		$malformed_settings_expected = [];

		return [
			[ \json_encode( $full_settings ), $full_settings_expected ],
			[ \json_encode( $missing_settings ), $missing_settings_expected ],
			[ \json_encode( $missing_settings ), $missing_settings_expected ],
		];
	}
}
