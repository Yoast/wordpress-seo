<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Ryte
 */

/**
 * Unit Test Class.
 *
 * @group ryte
 */
class WPSEO_Ryte_Option_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	protected $class_instance;

	/**
	 * Setting up the class instance.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Ryte_Option();
	}

	/**
	 * Test with the default options.
	 *
	 * @covers WPSEO_Ryte_Option::get_status
	 */
	public function test_get_status() {
		$this->assertEquals( $this->class_instance->get_status(), 99 );
	}

	/**
	 * First test with the value before, then set the status to 1 and test of status has been set.
	 *
	 * @covers WPSEO_Ryte_Option::set_status
	 */
	public function test_set() {
		$this->assertEquals( $this->class_instance->get_status(), 99 );
		$this->class_instance->set_status( '1' );
		$this->assertEquals( $this->class_instance->get_status(), '1' );
	}

	/**
	 * Test without the last fetch time being set.
	 *
	 * @covers WPSEO_Ryte_Option::should_be_fetched
	 */
	public function test_can_fetch() {
		$this->assertTrue( $this->class_instance->should_be_fetched() );
	}

	/**
	 * Test with the last fetch time being set to 15 minutes ago.
	 *
	 * @covers WPSEO_Ryte_Option::should_be_fetched
	 */
	public function test_cannot_fetch() {
		$this->class_instance->set_last_fetch( strtotime( '-5 seconds' ) );
		$this->assertFalse( $this->class_instance->should_be_fetched() );
	}

	/**
	 * Test with the last fetch time being set to 2 hours ago.
	 *
	 * @covers WPSEO_Ryte_Option::should_be_fetched
	 */
	public function test_cannot_fetch_two_hours_ago() {
		$this->class_instance->set_last_fetch( strtotime( '-2 hours' ) );
		$this->assertTrue( $this->class_instance->should_be_fetched() );
	}
}
