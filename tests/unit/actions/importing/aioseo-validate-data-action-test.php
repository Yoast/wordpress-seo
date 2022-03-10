<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Custom_Archive_Settings_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Default_Archive_Settings_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_General_Settings_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posttype_Defaults_Settings_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Taxonomy_Settings_Importing_Action;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Validate_Data_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Validate_Data_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Validate_Data_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Aioseo_Validate_Data_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Validate_Data_Action
	 */
	protected $instance;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|\wpdb
	 */
	protected $wpdb;

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
	 * The robots provider service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The Post Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_Posts_Importing_Action
	 */
	protected $post_importing_action;

	/**
	 * The Custom Archive Settings Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_Custom_Archive_Settings_Importing_Action
	 */
	protected $custom_archive_settings_importing_action;

	/**
	 * The Default Archive Settings Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_Default_Archive_Settings_Importing_Action
	 */
	protected $default_archive_settings_importing_action;

	/**
	 * The General Settings Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_General_Settings_Importing_Action
	 */
	protected $general_settings_importing_action;

	/**
	 * The Posttype Defaults Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_Posttype_Defaults_Settings_Importing_Action
	 */
	protected $posttype_defaults_settings_importing_action;

	/**
	 * The Taxonomy Settings Importing action.
	 *
	 * @var Mockery\MockInterface|Aioseo_Taxonomy_Settings_Importing_Action
	 */
	protected $taxonomy_settings_importing_action;

	/**
	 * The settings importing actions.
	 *
	 * @var array
	 */
	protected $settings_importing_actions;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpdb                  = Mockery::mock( 'wpdb' );
		$this->options               = Mockery::mock( Options_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->robots_provider       = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->post_importing_action = Mockery::mock( Aioseo_Posts_Importing_Action::class );

		$this->custom_archive_settings_importing_action    = Mockery::mock( Aioseo_Custom_Archive_Settings_Importing_Action::class );
		$this->default_archive_settings_importing_action   = Mockery::mock( Aioseo_Default_Archive_Settings_Importing_Action::class );
		$this->general_settings_importing_action           = Mockery::mock( Aioseo_General_Settings_Importing_Action::class );
		$this->posttype_defaults_settings_importing_action = Mockery::mock( Aioseo_Posttype_Defaults_Settings_Importing_Action::class );
		$this->taxonomy_settings_importing_action          = Mockery::mock( Aioseo_Taxonomy_Settings_Importing_Action::class );

		$this->instance = new Aioseo_Validate_Data_Action(
			$this->wpdb,
			$this->options,
			$this->wpdb_helper,
			$this->robots_provider,
			$this->custom_archive_settings_importing_action,
			$this->default_archive_settings_importing_action,
			$this->general_settings_importing_action,
			$this->posttype_defaults_settings_importing_action,
			$this->taxonomy_settings_importing_action,
			$this->post_importing_action
		);
	}

	/**
	 * Tests the checking if the validation action has been completed in the past.
	 *
	 * @param array $completed_option    The persistent completed option.
	 * @param int   $get_completed_times The times we're gonna get the persistent completed option.
	 * @param int   $expected_result     The expected result.
	 *
	 * @dataProvider provider_get_unindexed
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed( $completed_option, $get_completed_times, $expected_result ) {
		$this->options->expects( 'get' )
			->times( $get_completed_times )
			->with( 'importing_completed', [] )
			->andReturn( $completed_option );

		$unindexed = $this->instance->get_total_unindexed();
		$this->assertSame( $expected_result, $unindexed );
	}

	/**
	 * Tests the checking if the cleanup has been completed in the past.
	 *
	 * @param array $completed_option    The persistent completed option.
	 * @param int   $get_completed_times The times we're gonna get the persistent completed option.
	 * @param int   $expected_result     The expected result.
	 *
	 * @dataProvider provider_get_unindexed
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get_limited_unindexed_count( $completed_option, $get_completed_times, $expected_result ) {
		$this->options->expects( 'get' )
			->times( $get_completed_times )
			->with( 'importing_completed', [] )
			->andReturn( $completed_option );

		$unindexed = $this->instance->get_limited_unindexed_count( 1 );
		$this->assertSame( $expected_result, $unindexed );
	}

	/**
	 * Tests the validation of the AIOSEO indexable table.
	 *
	 * @param bool  $table_exists         Whether the AIOSEO indexable table exists.
	 * @param array $needed_data          The columns that we need from the AIOSEO indexable table.
	 * @param array $aioseo_columns       The columns in the AIOSEO indexable table.
	 * @param int   $aioseo_columns_times The columns in the AIOSEO indexable table.
	 * @param bool  $expected_result      The expected result.
	 *
	 * @dataProvider provider_validate_aioseo_table
	 * @covers ::validate_aioseo_table
	 */
	public function test_validate_aioseo_table( $table_exists, $needed_data, $aioseo_columns, $aioseo_columns_times, $expected_result ) {
		$this->post_importing_action->expects( 'aioseo_exists' )
			->once()
			->andReturn( $table_exists );

		$this->post_importing_action->expects( 'get_table' )
			->times( $aioseo_columns_times )
			->andReturn( 'wp_aioseo_posts' );

		$this->post_importing_action->expects( 'get_needed_data' )
			->times( $aioseo_columns_times )
			->andReturn( $needed_data );

		$this->wpdb->expects( 'get_col' )
			->times( $aioseo_columns_times )
			->with( 'SHOW COLUMNS FROM wp_aioseo_posts', 0 )
			->andReturn( $aioseo_columns );

		$validate_aioseo_table_result = $this->instance->validate_aioseo_table();
		$this->assertSame( $expected_result, $validate_aioseo_table_result );
	}

	/**
	 * Tests the validation of the AIOSEO settings from the options table.
	 *
	 * @param string $aioseo_settings    The AIOSEO settings.
	 * @param int    $get_option_times   The times we'll retrieve the AIOSEO settings.
	 * @param bool   $isset_settings_tab Whether the tab of each subsetting is set in the options.
	 * @param int    $isset_times        The times we'll check if the subsetting tab is set in the options.
	 * @param bool   $expected_result    The expected result of the validate_aioseo_settings().
	 *
	 * @dataProvider provider_validate_aioseo_settings
	 * @covers ::validate_aioseo_settings
	 */
	public function test_validate_aioseo_settings( $aioseo_settings, $get_option_times, $isset_settings_tab, $isset_times, $expected_result ) {
		$this->custom_archive_settings_importing_action->expects( 'get_source_option_name' )
			->times( $isset_times[0] )
			->andReturn( 'aioseo_options_dynamic' );

		$this->default_archive_settings_importing_action->expects( 'get_source_option_name' )
			->times( $isset_times[1] )
			->andReturn( 'aioseo_options_dynamic' );

		$this->general_settings_importing_action->expects( 'get_source_option_name' )
			->times( $isset_times[2] )
			->andReturn( 'aioseo_options_dynamic' );

		$this->posttype_defaults_settings_importing_action->expects( 'get_source_option_name' )
			->times( $isset_times[3] )
			->andReturn( 'aioseo_options_dynamic' );

		$this->taxonomy_settings_importing_action->expects( 'get_source_option_name' )
			->times( $isset_times[4] )
			->andReturn( 'aioseo_options_dynamic' );

		Monkey\Functions\expect( 'get_option' )
			->times( $get_option_times )
			->with( 'aioseo_options_dynamic', '' )
			->andReturn( $aioseo_settings );

		$this->custom_archive_settings_importing_action->expects( 'isset_settings_tab' )
			->times( $isset_times[0] )
			->with( \json_decode( $aioseo_settings, true ) )
			->andReturn( $isset_settings_tab[0] );

		$this->default_archive_settings_importing_action->expects( 'isset_settings_tab' )
			->times( $isset_times[1] )
			->with( \json_decode( $aioseo_settings, true ) )
			->andReturn( $isset_settings_tab[1] );

		$this->general_settings_importing_action->expects( 'isset_settings_tab' )
			->times( $isset_times[2] )
			->with( \json_decode( $aioseo_settings, true ) )
			->andReturn( $isset_settings_tab[2] );

		$this->posttype_defaults_settings_importing_action->expects( 'isset_settings_tab' )
			->times( $isset_times[3] )
			->with( \json_decode( $aioseo_settings, true ) )
			->andReturn( $isset_settings_tab[3] );

		$this->taxonomy_settings_importing_action->expects( 'isset_settings_tab' )
			->times( $isset_times[4] )
			->with( \json_decode( $aioseo_settings, true ) )
			->andReturn( $isset_settings_tab[4] );

		$validate_aioseo_settings_result = $this->instance->validate_aioseo_settings();
		$this->assertSame( $expected_result, $validate_aioseo_settings_result );
	}

	/**
	 * Tests the validation of the post AIOSEO robots settings from the options table.
	 *
	 * @param string $aioseo_global_settings The AIOSEO global settings.
	 * @param int    $aioseo_posts_settings  The post AIOSEO settings.
	 * @param bool   $expected_result        The expected result of the validate_post_robot_settings().
	 *
	 * @dataProvider provider_validate_post_robot_settings
	 * @covers ::validate_post_robot_settings
	 */
	public function test_validate_post_robot_settings( $aioseo_global_settings, $aioseo_posts_settings, $expected_result ) {
		$post_robot_mapping = [
			'type'        => 'postTypes',
			'option_name' => 'aioseo_options_dynamic',
		];

		$this->post_importing_action->expects( 'enhance_mapping' )
			->once()
			->andReturn( $post_robot_mapping );

		$this->robots_provider->expects( 'get_global_option' )
			->once()
			->andReturn( $aioseo_global_settings );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'aioseo_options_dynamic', '' )
			->andReturn( $aioseo_posts_settings );

		$needed_robots_data = [
			'nofollow',
			'noarchive',
			'nosnippet',
			'noimageindex',
		];

		$this->post_importing_action->expects( 'get_needed_robot_data' )
			->once()
			->andReturn( $needed_robots_data );

		$validate_post_robot_settings_result = $this->instance->validate_post_robot_settings();
		$this->assertSame( $expected_result, $validate_post_robot_settings_result );
	}

	/**
	 * Tests the validation of the default AIOSEO robots settings for search appearance settings from the options table.
	 *
	 * @param array $robot_setting_map   The robot setting map for each action.
	 * @param array $pluck_setting_times The times we pluck the robot setting map.
	 * @param array $aioseo_settings     The AIOSEO settings.
	 * @param int   $get_option_times    The times we retrieve the AIOSEO settings.
	 * @param bool  $expected_result    The expected result of the validate_default_robot_settings().
	 *
	 * @dataProvider provider_validate_default_robot_settings
	 * @covers ::validate_default_robot_settings
	 */
	public function test_validate_default_robot_settings( $robot_setting_map, $pluck_setting_times, $aioseo_settings, $get_option_times, $expected_result ) {
		$this->custom_archive_settings_importing_action->expects( 'pluck_robot_setting_from_mapping' )
			->times( $pluck_setting_times[0] )
			->andReturn( $robot_setting_map[0] );

		$this->default_archive_settings_importing_action->expects( 'pluck_robot_setting_from_mapping' )
			->times( $pluck_setting_times[1] )
			->andReturn( $robot_setting_map[1] );

		$this->general_settings_importing_action->expects( 'pluck_robot_setting_from_mapping' )
			->times( $pluck_setting_times[2] )
			->andReturn( $robot_setting_map[2] );

		$this->posttype_defaults_settings_importing_action->expects( 'pluck_robot_setting_from_mapping' )
			->times( $pluck_setting_times[3] )
			->andReturn( $robot_setting_map[3] );

		$this->taxonomy_settings_importing_action->expects( 'pluck_robot_setting_from_mapping' )
			->times( $pluck_setting_times[4] )
			->andReturn( $robot_setting_map[4] );

		Monkey\Functions\expect( 'get_option' )
			->times( $get_option_times )
			->with( 'aioseo_options_dynamic', '' )
			->andReturn( $aioseo_settings );

		$validate_default_robot_settings_result = $this->instance->validate_default_robot_settings();
		$this->assertSame( $expected_result, $validate_default_robot_settings_result );
	}

	/**
	 * Data provider for test_validate_default_robot_settings().
	 *
	 * @return array
	 */
	public function provider_validate_default_robot_settings() {
		$robot_setting_map_custom_archives_empty    = [];
		$robot_setting_map_default_archives_all_set = [
			'option_name' => 'aioseo_options_dynamic',
			'type'        => 'archives',
			'subtype'     => 'author',
		];
		$robot_setting_map_general_empty            = [];
		$robot_setting_map_posttypes_empty          = [];
		$robot_setting_map_taxonomies_empty         = [];

		$aioseo_settings_all_set          = [
			'searchAppearance' => [
				'archives' => [
					'author' => [
						'advanced' => [
							'robotsMeta' => [
								'default' => true,
							],
						],
					],
				],
			],
		];
		$aioseo_settings_not_all_set      = [
			'searchAppearance' => [
				'archives' => [
					'author' => [
						'advanced' => [
							'robotsMeta' => [
								'not_default' => true,
							],
						],
					],
				],
			],
		];
		$aioseo_settings_wrong_key        = [
			'not_searchAppearance' => [
				'archives' => [
					'author' => [
						'advanced' => [
							'robotsMeta' => [
								'not_default' => true,
							],
						],
					],
				],
			],
		];
		$aioseo_settings_wrong_subsetting = [
			'not_searchAppearance' => [
				'archives' => [
					'author' => [
						'advanced' => [
							'robotsMeta' => [
								'not_default' => true,
							],
						],
					],
				],
			],
		];

		return [
			[
				[
					$robot_setting_map_custom_archives_empty,
					$robot_setting_map_default_archives_all_set,
					$robot_setting_map_general_empty,
					$robot_setting_map_posttypes_empty,
					$robot_setting_map_taxonomies_empty,
				],
				[ 1, 1, 1, 1, 1 ],
				\json_encode( $aioseo_settings_all_set ),
				1,
				true,
			],
			[
				[
					$robot_setting_map_custom_archives_empty,
					$robot_setting_map_default_archives_all_set,
					$robot_setting_map_general_empty,
					$robot_setting_map_posttypes_empty,
					$robot_setting_map_taxonomies_empty,
				],
				[ 1, 1, 0, 0, 0 ],
				\json_encode( $aioseo_settings_not_all_set ),
				1,
				false,
			],
			[
				[
					$robot_setting_map_custom_archives_empty,
					$robot_setting_map_default_archives_all_set,
					$robot_setting_map_general_empty,
					$robot_setting_map_posttypes_empty,
					$robot_setting_map_taxonomies_empty,
				],
				[ 1, 1, 0, 0, 0 ],
				\json_encode( $aioseo_settings_wrong_key ),
				1,
				false,
			],
			[
				[
					$robot_setting_map_custom_archives_empty,
					$robot_setting_map_default_archives_all_set,
					$robot_setting_map_general_empty,
					$robot_setting_map_posttypes_empty,
					$robot_setting_map_taxonomies_empty,
				],
				[ 1, 1, 0, 0, 0 ],
				\json_encode( $aioseo_settings_wrong_subsetting ),
				1,
				false,
			],
		];
	}

	/**
	 * Data provider for test_validate_post_robot_settings().
	 *
	 * @return array
	 */
	public function provider_validate_post_robot_settings() {
		$aioseo_global_settings_all_set = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'      => true,
						'noindex'      => false,
						'nofollow'     => true,
						'noarchive'    => false,
						'noimageindex' => true,
						'nosnippet'    => false,
					],
				],
			],
		];

		$aioseo_posts_settings_all_set = [
			'searchAppearance' => [
				'postTypes' => [
					'post' => [
						'advanced' => [
							'robotsMeta' => [
								'default'      => true,
								'noindex'      => false,
								'nofollow'     => true,
								'noarchive'    => false,
								'noimageindex' => true,
								'nosnippet'    => false,
							],
						],
					],
				],
			],
		];

		$aioseo_global_settings_wrong_key = [
			'not_searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'      => true,
						'noindex'      => false,
						'nofollow'     => true,
						'noarchive'    => false,
						'noimageindex' => true,
						'nosnippet'    => false,
					],
				],
			],
		];

		$aioseo_posts_settings_wrong_key = [
			'not_searchAppearance' => [
				'postTypes' => [
					'post' => [
						'advanced' => [
							'robotsMeta' => [
								'default'      => true,
								'noindex'      => false,
								'nofollow'     => true,
								'noarchive'    => false,
								'noimageindex' => true,
								'nosnippet'    => false,
							],
						],
					],
				],
			],
		];

		$aioseo_global_settings_wrong_robot_key = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'      => true,
						'not_noindex'  => false,
						'nofollow'     => true,
						'noarchive'    => false,
						'noimageindex' => true,
						'nosnippet'    => false,
					],
				],
			],
		];

		$aioseo_posts_settings_wrong_robot_key = [
			'searchAppearance' => [
				'postTypes' => [
					'post' => [
						'advanced' => [
							'robotsMeta' => [
								'default'      => true,
								'not_noindex'  => false,
								'nofollow'     => true,
								'noarchive'    => false,
								'noimageindex' => true,
								'nosnippet'    => false,
							],
						],
					],
				],
			],
		];

		return [
			[ $aioseo_global_settings_all_set, \json_encode( $aioseo_posts_settings_all_set ), true ],
			[ $aioseo_global_settings_all_set, \json_encode( $aioseo_posts_settings_wrong_key ), false ],
			[ $aioseo_global_settings_wrong_key, \json_encode( $aioseo_posts_settings_all_set ), false ],
			[ $aioseo_global_settings_all_set, \json_encode( $aioseo_posts_settings_wrong_robot_key ), false ],
			[ $aioseo_global_settings_wrong_robot_key, \json_encode( $aioseo_posts_settings_all_set ), false ],
		];
	}

	/**
	 * Data provider for test_validate_aioseo_settings().
	 *
	 * @return array
	 */
	public function provider_validate_aioseo_settings() {
		$aioseo_settings = [
			'searchAppearance' => [
				'archive'    => 'settings',
				'global'     => 'settings',
				'postTypes'  => 'settings',
				'taxonomies' => 'settings',
			],
		];

		$isset_settings_tab_all_set = [
			true,
			true,
			true,
			true,
			true,
		];
		$isset_times_all_set        = [
			1,
			1,
			1,
			1,
			1,
		];

		$isset_settings_tab_first_not_set = [
			false,
			'irrelevant',
			'irrelevant',
			'irrelevant',
			'irrelevant',
		];
		$isset_times_first_not_set        = [
			1,
			0,
			0,
			0,
			0,
		];

		$isset_settings_tab_last_not_set = [
			true,
			true,
			true,
			true,
			false,
		];
		$isset_times_last_not_set        = [
			1,
			1,
			1,
			1,
			1,
		];

		return [
			[ \json_encode( $aioseo_settings ), 5, $isset_settings_tab_all_set, $isset_times_all_set, true ],
			[ \json_encode( $aioseo_settings ), 1, $isset_settings_tab_first_not_set, $isset_times_first_not_set, false ],
			[ \json_encode( $aioseo_settings ), 5, $isset_settings_tab_last_not_set, $isset_times_last_not_set, false ],
		];
	}

	/**
	 * Data provider for test_validate_aioseo_table().
	 *
	 * @return array
	 */
	public function provider_validate_aioseo_table() {
		return [
			[ false, [ 'irrelevant' ], [ 'irrelevant' ], 0, false ],
			[
				true,
				[
					'col1',
					'col2',
					'col3',
				],
				[
					'col1',
					'col2',
					'col3',
				],
				1,
				true,
			],
			[
				true,
				[
					'col1',
					'col2',
					'col3',
				],
				[
					'col1',
					'col2',
				],
				1,
				false,
			],
		];
	}

	/**
	 * Data provider for test_get_total_unindexed() and test_get_limited_unindexed_count().
	 *
	 * @return array
	 */
	public function provider_get_unindexed() {
		$completed                 = [
			'aioseo_validate_data' => true,
		];
		$not_completed             = [
			'aioseo_validate_data' => false,
		];
		$not_completed_with_no_key = [];

		return [
			[ $completed, 1, 0 ],
			[ $not_completed, 1, 1 ],
			[ $not_completed_with_no_key, 1, 1 ],
		];
	}
}
