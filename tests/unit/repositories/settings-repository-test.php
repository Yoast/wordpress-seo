<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Brain\Monkey;
use Exception;
use InvalidArgumentException;
use Yoast\WP\SEO\Models\Settings\Open_Graph_Settings;
use Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings;
use Yoast\WP\SEO\Models\Settings\Social_Settings;
use Yoast\WP\SEO\Models\Settings_Model;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Settings_Model_Double;
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
			->andReturn(
				[
					'settings_key' => 'settings_value',
				]
			);

		$this->instance = new Settings_Repository();
		$this->instance->add_initializer( 'settings-double', Settings_Model_Double::class );
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
			self::getPropertyValue( $this->instance, 'settings' )
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
	 * @covers ::get_settings_model
	 * @covers ::initialize_settings_for_model
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

	/**
	 * Tests adding an initializer to the list of initializers.
	 *
	 * @covers ::add_initializer
	 */
	public function test_adding_an_initializer() {
		$this->instance->add_initializer( 'test-initializer', Settings_Model::class );

		$initializers = self::getPropertyValue( $this->instance, 'initializers' );

		static::assertArrayHasKey( 'test-initializer', $initializers );
		static::assertEquals( Settings_Model::class, $initializers['test-initializer'] );
	}

	/**
	 * Tests adding an existing initializer to the list of initializers.
	 *
	 * @covers ::add_initializer
	 */
	public function test_add_an_existing_initializer() {
		$this->instance->add_initializer( 'test-initializer', Settings_Model::class );

		$this->expectException( Exception::class );
		$this->expectExceptionMessage( 'Initializer for test-initializer already exists.' );

		$this->instance->add_initializer( 'test-initializer', Settings_Model::class );
	}

	/**
	 * Tests saving of the settings with the settings not being an array.
	 *
	 * @covers ::save
	 */
	public function test_save_invalid_settings_given() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Settings is not an array' );

		$this->instance->save( 'invalid settings' );
	}

	/**
	 * Tests saving the settings where update_option fails.
	 *
	 * @covers ::save
	 */
	public function test_saving_settings_with_update_option_failed() {
		$settings = [
			'settings_key' => 'new_settings_value',
		];

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, $settings, true )
			->andReturnFalse();

		$this->instance->save( $settings );

		self::assertSame(
			[
				'settings_key' => 'settings_value',
			],
			self::getPropertyValue( $this->instance, 'settings' )
		);
	}

	/**
	 * Tests saving the settings where update_option fails.
	 *
	 * @covers ::save
	 */
	public function test_saving_settings_where_an_existing_value_is_changed() {
		$settings = [
			'settings_key' => 'new_settings_value',
		];

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, $settings, true )
			->andReturnTrue();

		$this->instance->save( $settings );

		self::assertSame(
			$settings,
			self::getPropertyValue( $this->instance, 'settings' )
		);
	}

	/**
	 * Tests saving the settings where update_option fails.
	 *
	 * @covers ::save
	 */
	public function test_saving_settings_where_a_new_value_is_added() {
		$expected_settings = [
			'settings_key'     => 'settings_value',
			'new_settings_key' => 'new_settings_value',
		];

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, $expected_settings, true )
			->andReturn( true );

		$this->instance->save(
			[
				'new_settings_key' => 'new_settings_value',
			]
		);

		self::assertSame(
			$expected_settings,
			self::getPropertyValue( $this->instance, 'settings' )
		);
	}

	/**
	 * Test that no longer available options are discarded when saving the options.
	 *
	 * @covers ::save
	 * @covers ::clean_settings
	 */
	public function test_save_should_discard_no_longer_available_options() {
		$expected_settings = [
			'settings_key' => 'settings_value',
		];

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, [] )
			->andReturn(
				[
					'settings_key'               => 'settings_value',
					'no_longer_available_option' => 'old_value',
				]
			);

		$instance = new Settings_Repository();
		$instance->add_initializer( 'settings-double', Settings_Model_Double::class );

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Settings_Repository::OPTION_NAME, $expected_settings, true )
			->andReturn( true );

		$instance->save( [] );

		self::assertSame(
			$expected_settings,
			self::getPropertyValue( $this->instance, 'settings' )
		);
	}
}
