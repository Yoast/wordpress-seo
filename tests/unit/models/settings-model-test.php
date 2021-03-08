<?php

namespace Yoast\WP\SEO\Tests\Unit\Models;

use Exception;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Models\Settings_Model;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Settings_Model_Test.
 *
 * @group models
 *
 * @coversDefaultClass \\Yoast\WP\SEO\Models\Settings_Model
 */
class Settings_Model_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Settings_Model|MockInterface
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Settings_Model::class );
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
}
