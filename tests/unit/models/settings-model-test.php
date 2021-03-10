<?php

namespace Yoast\WP\SEO\Tests\Unit\Models;

use Exception;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Models\Settings_Model;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Settings_Model_Test.
 *
 * @group models
 * @group settings
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Settings_Model
 */
class Settings_Model_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Settings_Model|MockInterface
	 */
	protected $instance;

	/**
	 * Represents the settings repository.
	 *
	 * @var Mockery\MockInterface|Settings_Repository
	 */
	protected $settings_repository;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->settings_repository = Mockery::mock( Settings_Repository::class );
		$this->instance            = Mockery::mock( Settings_Model::class, [ $this->settings_repository ] )->makePartial();
	}

	/**
	 * Test setting a non-existing setting.
	 *
	 * @covers ::__set
	 */
	public function test_setting_non_existing_setting() {
		$this->instance->expects( 'get_settings' )->once()->andReturn( [ 'existing_setting' => [] ] );

		$this->expectException( Exception::class );

		$this->instance->non_existing_setting = 'value';
	}

	/**
	 * Test setting an existing setting.
	 *
	 * @covers ::__set
	 * @covers ::__get
	 */
	public function test_getting_setting_existing_setting() {
		$this->instance->expects( 'get_settings' )->twice()->andReturn( [ 'existing_setting' => [] ] );

		$this->instance->existing_setting = 'value';

		self::assertSame( 'value', $this->instance->existing_setting );
	}

	/**
	 * Test getting an non-existing setting.
	 *
	 * @covers ::__get
	 */
	public function test_getting_non_existing_setting() {
		$this->instance->expects( 'get_settings' )->once()->andReturn( [ 'existing_setting' => [] ] );

		$this->expectException( Exception::class );

		$this->instance->non_existing_setting;
	}

	/**
	 * Test getting the default value if no value exists yet.
	 *
	 * @covers ::__get
	 */
	public function test_get_falls_back_to_default() {
		$this->instance->expects( 'get_settings' )->twice()->andReturn( [ 'default_setting' => [ 'default' => 12 ] ] );

		self::assertSame( 12, $this->instance->default_setting );
	}

	/**
	 * Tests the save function by setting the value of the model.
	 *
	 * @covers ::save
	 */
	public function test_save_with_set_data() {
		$this->instance
			->expects( 'get_settings' )
			->twice()
			->andReturn( [ 'settings_key' => [] ] );

		$this->instance->settings_key = 'settings_value';

		$this->settings_repository
			->expects( 'save' )
			->once()
			->with(
				[
					'settings_key' => 'settings_value',
				]
			);

		$this->instance->save();
	}

	/**
	 * Tests the save function with fallback to a default value for the settings of the model.
	 *
	 * @covers ::save
	 */
	public function test_save_with_default_data() {
		$this->instance
			->expects( 'get_settings' )
			->once()
			->andReturn(
				[
					'settings_key' => [
						'default' => 'default_settings_value',
					],
				]
			);

		$this->settings_repository
			->expects( 'save' )
			->once()
			->with(
				[
					'settings_key' => 'default_settings_value',
				]
			);

		$this->instance->save();
	}
}
