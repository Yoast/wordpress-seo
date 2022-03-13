<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Robots_Transformer_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service
 * @phpcs:disable Yoast.Yoast.AlternativeFunctions.json_encode_json_encode,Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Robots_Transformer_Service_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Provider_Service
	 */
	protected $aioseo_robots_provider_service;

	/**
	 * The class under test.
	 *
	 * @var Aioseo_Robots_Transformer_Service
	 */
	protected $aioseo_robots_transformer_service;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->robots_provider                   = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->aioseo_robots_transformer_service = new Aioseo_Robots_Transformer_Service( $this->robots_provider );
	}

	/**
	 * Tests the getting of the noindex setting set globally in AIOSEO.
	 *
	 * @dataProvider provider_transform_robot_setting
	 * @covers ::transform_robot_setting
	 *
	 * @param array  $aioseo_options                  The AIOSEO settings.
	 * @param string $setting_name                    The setting name, eg. noindex, nofollow, etc.
	 * @param bool   $setting_value                   The setting value, without taking into consideration whether the type defers to global defaults.
	 * @param array  $mapping                         The mapping of the setting we're working with.
	 * @param int    $get_global_robot_settings_times The times the get_global_robot_settings() is called.
	 * @param bool   $global_setting_value            What the get_global_robot_settings() returns.
	 * @param bool   $expected_result                 The expected result.
	 */
	public function test_transform_robot_setting( $aioseo_options, $setting_name, $setting_value, $mapping, $get_global_robot_settings_times, $global_setting_value, $expected_result ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( $mapping['option_name'], '' )
			->andReturn( $aioseo_options );

		$this->robots_provider->expects( 'get_global_robot_settings' )
			->times( $get_global_robot_settings_times )
			->with( $setting_name )
			->andReturn( $global_setting_value );

		$actual_result = $this->aioseo_robots_transformer_service->transform_robot_setting( $setting_name, $setting_value, $mapping );
		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_transform_robot_setting() {
		$mapping = [
			'option_name' => 'aioseo_table',
			'type'        => 'type',
			'subtype'     => 'subtype',
		];

		$empty_settings = '';

		$global_robots_meta = [
			'searchAppearance' => [
				'type' => [
					'subtype' => [
						'advanced' => [
							'robotsMeta' => [
								'default' => true,
							],
						],
					],
				],
			],
		];

		$no_global_robots_meta = [
			'searchAppearance' => [
				'type' => [
					'subtype' => [
						'advanced' => [
							'robotsMeta' => [
								'default' => false,
							],
						],
					],
				],
			],
		];

		$malformed_global_robots_meta = [
			'searchAppearance' => [
				'type' => [
					'subtype' => [
						'advanced' => [
							'robotsMeta' => [
								'not_default' => 'random',
							],
						],
					],
				],
			],
		];

		return [
			[ \json_encode( $empty_settings ), 'noindex', false, $mapping, 0, 'irrelevant', false ],
			[ \json_encode( $empty_settings ), 'noindex', true, $mapping, 0, 'irrelevant', true ],
			[ \json_encode( $global_robots_meta ), 'noindex', 'irrelevant', $mapping, 1, true, true ],
			[ \json_encode( $global_robots_meta ), 'noindex', 'irrelevant', $mapping, 1, false, false ],
			[ \json_encode( $no_global_robots_meta ), 'noindex', true, $mapping, 0, 'irrelevant', true ],
			[ \json_encode( $no_global_robots_meta ), 'noindex', false, $mapping, 0, 'irrelevant', false ],
			[ \json_encode( $malformed_global_robots_meta ), 'noindex', false, $mapping, 0, 'irrelevant', false ],
			[ \json_encode( $malformed_global_robots_meta ), 'noindex', true, $mapping, 0, 'irrelevant', true ],
		];
	}
}
