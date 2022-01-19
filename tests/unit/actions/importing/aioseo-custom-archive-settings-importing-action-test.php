<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Custom_Archive_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Custom_Archive_Settings_Importing_Action_Double;

/**
 * Aioseo_Custom_Archive_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo_Custom_Archive_Settings_Importing_Action
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
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

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

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->post_type          = Mockery::mock( Post_Type_Helper::class );
		$this->replacevar_handler = Mockery::mock( Aioseo_Replacevar_Handler::class );
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->instance           = new Aioseo_Custom_Archive_Settings_Importing_Action( $this->options, $this->post_type, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer );
		$this->mock_instance      = Mockery::mock(
			Aioseo_Custom_Archive_Settings_Importing_Action_Double::class,
			[ $this->options, $this->post_type, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
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
	 * Tests flattening AIOSEO custom archive settings.
	 *
	 * @covers ::flatten_settings
	 */
	public function test_flatten_settings() {
		$flattened_sesttings = $this->mock_instance->flatten_settings( $this->full_settings_to_import );
		$expected_result     = $this->flattened_settings_to_import;

		$this->assertSame( $expected_result, $flattened_sesttings );
	}

	/**
	 * Tests mapping AIOSEO custom archive settings.
	 *
	 * @param string $setting                The setting at hand, eg. post or movie-category, separator etc.
	 * @param string $setting_value          The value of the AIOSEO setting at hand.
	 * @param int    $times                  The times that we will import each setting, if any.
	 * @param int    $transform_times        The times that we will transform each setting, if any.
	 * @param int    $transform_robots_times The times that we will transform each robot setting, if any.
	 *
	 * @dataProvider provider_map
	 * @covers ::map
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
	 * @return string
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
				'archives'   => 'not_array',
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
