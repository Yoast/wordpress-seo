<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Brain\Monkey;
use Yoast\WP\SEO\Models\Settings\Open_Graph_Settings;
use Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings;
use Yoast\WP\SEO\Models\Settings\Social_Settings;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Settings_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Settings_Repository
 *
 * @group repositories
 * @group settings
 */
class Settings_Repository_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Settings_Repository
	 */
	protected $instance;

	/**
	 * Setup the instance to test.
	 */
	public function set_up() {
		parent::set_up();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, [] )
			->andReturn( [
				'settings_key' => 'settings_value',
			] );

		$this->instance = new Settings_Repository();
	}

	/**
	 * Tests the constructor
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertSame(
			[
				'settings_key' => 'settings_value',
			],
			self::getPropertyValue( $this->instance, 'option_value' )
		);
	}

	/**
	 * Tests the magic __call method without having the for_ prefix.
	 *
	 * @covers ::__call
	 */
	public function test_method_without_the_for_prefix() {
		static::assertNull( $this->instance->foo() );
	}

	/**
	 * Tests the magic __call method for an unsupported setting.
	 *
	 * @covers ::__call
	 */
	public function test_call_method_for_unsupported_setting() {
		static::assertNull( $this->instance->for_bar() );
	}

	/**
	 * Tests the magic __call method for a supported setting.
	 *
	 * @covers ::__call
	 * @covers ::get_setting
	 *
	 * @dataProvider supported_setting_provider
	 *
	 * @param string $expected_instance The expected instance.
	 * @param string $method            The method to call.
	 */
	public function test_call_method_for_supported_setting( $expected_instance, $method ) {
		static::assertInstanceOf( $expected_instance, $this->instance->$method() );
	}

	/**
	 * The data provider for test `test_call_method_for_supported_setting`
	 *
	 * @return array<array<string, string>>
	 */
	public function supported_setting_provider() {
		return [
			[
				'expected_instance' => Social_Settings::class,
				'method'            => 'for_social',
			],
			[
				'expected_instance' => Open_Graph_Settings::class,
				'method'            => 'for_open_graph',
			],
			[
				'expected_instance' => Search_Engine_Verify_Settings::class,
				'method'            => 'for_search_engine_verifications',
			],
		];
	}
}
