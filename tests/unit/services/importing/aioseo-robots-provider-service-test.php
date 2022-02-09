<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Robots_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service
 * @phpcs:disable Yoast.Yoast.AlternativeFunctions.json_encode_json_encode,Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Robots_Provider_Service_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Aioseo_Robots_Provider_Service
	 */
	protected $aioseo_robots_provider_service;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->aioseo_robots_provider_service = new Aioseo_Robots_Provider_Service();
	}

	/**
	 * Tests the getting of the noindex setting set globally in AIOSEO.
	 *
	 * @param array  $aioseo_options  The AIOSEO settings.
	 * @param string $setting         The setting we're working with.
	 * @param bool   $expected_result The expected result.
	 *
	 * @dataProvider provider_get_global_robot_settings
	 * @covers ::get_global_robot_settings
	 */
	public function test_get_global_robot_settings( $aioseo_options, $setting, $expected_result ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'aioseo_options', '' )
			->andReturn( $aioseo_options );

		$actual_result = $this->aioseo_robots_provider_service->get_global_robot_settings( $setting );
		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Tests the getting of the noindex setting set globally in AIOSEO.
	 *
	 * @param array $aioseo_options  The AIOSEO settings.
	 * @param array $mapping         The mapping of the setting we're working with.
	 * @param bool  $expected_result The expected result.
	 *
	 * @dataProvider provider_get_subtype_robot_setting
	 * @covers ::get_subtype_robot_setting
	 */
	public function test_get_subtype_robot_setting( $aioseo_options, $mapping, $expected_result ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( $mapping['option_name'], '' )
			->andReturn( $aioseo_options );

		$actual_result = $this->aioseo_robots_provider_service->get_subtype_robot_setting( $mapping );
		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return string
	 */
	public function provider_get_subtype_robot_setting() {
		$mapping = [
			'option_name' => 'aioseo_table',
			'type'        => 'type',
			'subtype'     => 'subtype',
			'robot_type'  => 'nofollow',
		];

		$nofollow = [
			'searchAppearance' => [
				'type' => [
					'subtype' => [
						'advanced' => [
							'robotsMeta' => [
								'nofollow' => true,
							],
						],
					],
				],
			],
		];

		$no_nofollow = [
			'searchAppearance' => [
				'type' => [
					'subtype' => [
						'advanced' => [
							'robotsMeta' => [
								'nofollow' => false,
							],
						],
					],
				],
			],
		];

		return [
			[ \json_encode( $nofollow ), $mapping, true ],
			[ \json_encode( $no_nofollow ), $mapping, false ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return string
	 */
	public function provider_get_global_robot_settings() {
		$empty_settings = '';

		$no_global_robots_meta = [
			'searchAppearance' => [
				'advanced' => [
					'not_globalRobotsMeta' => [
						'default' => true,
					],
				],
			],
		];

		$no_set_default_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'not_default' => 'whatever',
					],
				],
			],
		];

		$default_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default' => true,
						'noindex' => 'whatever',
					],
				],
			],
		];

		$no_default_no_noindex_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'     => false,
						'not_noindex' => 'whatever',
					],
				],
			],
		];

		$no_default_noindex_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default' => false,
						'noindex' => true,
					],
				],
			],
		];

		$no_default_disabled_noindex_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default' => false,
						'noindex' => false,
					],
				],
			],
		];

		$no_default_disabled_nofollow_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'  => false,
						'nofollow' => false,
					],
				],
			],
		];

		$no_default_disabled_no_nofollow_global = [
			'searchAppearance' => [
				'advanced' => [
					'globalRobotsMeta' => [
						'default'  => false,
						'nofollow' => true,
					],
				],
			],
		];

		return [
			[ \json_encode( $empty_settings ), 'noindex', false ],
			[ \json_encode( $no_global_robots_meta ), 'noindex', false ],
			[ \json_encode( $no_set_default_global ), 'noindex', false ],
			[ \json_encode( $default_global ), 'noindex', false ],
			[ \json_encode( $no_default_no_noindex_global ), 'noindex', false ],
			[ \json_encode( $no_default_noindex_global ), 'noindex', true ],
			[ \json_encode( $no_default_disabled_noindex_global ), 'noindex', false ],
			[ \json_encode( $no_default_disabled_nofollow_global ), 'nofollow', false ],
			[ \json_encode( $no_default_disabled_no_nofollow_global ), 'nofollow', true ],
		];
	}
}
