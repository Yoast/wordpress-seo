<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posttype_Defaults_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posttype_Defaults_Settings_Importing_Action_Double;

/**
 * Aioseo_Posttype_Defaults_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo_Posttype_Defaults_Settings_Importing_Action
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
	 * An array of the total Posttype Defaults Settings we can import.
	 *
	 * @var Mockery\MockInterface|Options_Helper
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
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options       = Mockery::mock( Options_Helper::class );
		$this->instance      = new Aioseo_Posttype_Defaults_Settings_Importing_Action( $this->options );
		$this->mock_instance = Mockery::mock(
			Aioseo_Posttype_Defaults_Settings_Importing_Action_Double::class,
			[ $this->options ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the getting of the source option_name.
	 *
	 * @covers ::get_source_option_name
	 */
	public function test_get_source_option_name() {
		$source_option_name = $this->instance->get_source_option_name();
		$this->assertEquals( $source_option_name, 'aioseo_options_dynamic' );
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
		$this->assertTrue( $settings_to_import === $expected );
	}

	/**
	 * Tests flattening AIOSEO Posttype Defaults settings.
	 *
	 * @covers ::flatten_settings
	 */
	public function test_flatten_settings() {
		$flattened_sesttings = $this->mock_instance->flatten_settings( $this->full_settings_to_import );
		$expected_result     = [
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

		$this->assertTrue( $expected_result === $flattened_sesttings );
	}

	/**
	 * Tests mapping AIOSEO Posttype Defaults settings.
	 *
	 * @param string $setting       The setting at hand, eg. post or movie-category, separator etc.
	 * @param string $setting_value The value of the AIOSEO setting at hand.
	 *
	 * @dataProvider provider_map
	 * @covers ::map
	 */
	public function test_map( $setting, $setting_value ) {
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

		if ( isset( $aioseo_options_to_yoast_map[ $setting ] ) ) {
			$this->mock_instance->shouldReceive( 'import_single_setting' )
				->with( $setting, $setting_value, $aioseo_options_to_yoast_map[ $setting ] )
				->once();
		}
		else {
			$this->mock_instance->shouldReceive( 'import_single_setting' )
				->never();
		}

		$this->mock_instance->map( $setting_value, $setting );
	}

	/**
	 * Data provider for test_map().
	 *
	 * @return array
	 */
	public function provider_map() {
		return [
			[ '/category/title', 'Category Title' ],
			[ '/category/metaDescription', 'Category Desc' ],
			[ '/post_tag/show', 'Tag Title' ],
			[ '/post_tag/metaDescription', 'Tag Title' ],
			[ '/book-category/title', 'Category Title' ],
			[ '/book-category/metaDescription', 'Category Desc' ],
			[ '/randomSetting', 'randomeValue' ],
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
				'postTypes'   => $this->full_settings_to_import,
				'archives'    => [
					'author' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			],
		];

		$full_settings_expected = $this->full_settings_to_import;

		$missing_settings = [
			'searchAppearance' => [
				'archives' => [
					'author' => [
						'title'           => 'title1',
						'metaDescription' => 'desc1',
					],
				],
			],
		];

		$missing_settings_expected = [];

		$malformed_settings = [
			'searchAppearance' => [
				'postTypes' => 'not_array',
				'archives'  => [
					'author' => [
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
