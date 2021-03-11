<?php

namespace Yoast\WP\SEO\Tests\Unit\Models\Settings;

use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Models\Settings\Object_Settings_Model;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Object_Settings_Model_Test.
 *
 * @group models
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Settings\Object_Settings_Model
 */
class Object_Settings_Model_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var MockInterface|Object_Settings_Model
	 */
	protected $instance;

	/**
	 * Represents the settings repository.
	 *
	 * @var Mockery\MockInterface|Settings_Repository
	 */
	protected $settings_repository;

	/**
	 * Sets the instance to test.
	 */
	public function set_up() {
		parent::set_up();

		$this->settings_repository = Mockery::mock( Settings_Repository::class )->makePartial();
		$this->instance            = Mockery::mock( Object_Settings_Model::class, [ $this->settings_repository, 'object_type' ] )->makePartial();
	}

	/**
	 * Tests the constructor by checking the assignment of object_name.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		static::assertSame(
			'object_type',
			static::getPropertyValue( $this->instance, 'object_name' )
		);
	}

	/**
	 * Tests the retrieval of the object name.
	 *
	 * @covers ::get_object_name
	 */
	public function test_get_object_name() {
		static::assertSame( 'object_type', $this->instance->get_object_name() );
	}
}
