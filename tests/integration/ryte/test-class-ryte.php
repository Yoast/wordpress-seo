<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Ryte
 */

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Ryte_Integration;

/**
 * Unit Test Class.
 *
 * @group ryte
 */
class WPSEO_Ryte_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Ryte_Integration
	 */
	protected $class_instance;

	/**
	 * Holds the instance of the option related to the class being tested.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	private $option_instance;

	/**
	 * An options helper instance that both the tests and the test double require to check if Ryte is enabled or not.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Setup the class instance.
	 */
	public function set_up() {
		parent::set_up();

		$this->options_helper  = new Options_Helper();
		$this->class_instance  = new WPSEO_Ryte_Double( $this->options_helper );
		$this->option_instance = $this->class_instance->get_option();
	}

	/**
	 * Test if the weekly schedule exists.
	 *
	 * @covers Ryte_Integration::maybe_add_weekly_schedule
	 * @covers Ryte_Integration::add_weekly_schedule
	 */
	public function test_add_weekly_schedule() {
		// The method `maybe_add_weekly_schedule()` is called on class instantiation.
		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );
	}

	/**
	 * Test if the weekly schedule is added to wp_get_schedules when the filter is passed a non-array value.
	 *
	 * @link https://github.com/Yoast/wordpress-seo/issues/9450
	 * @link https://github.com/Yoast/wordpress-seo/issues/9475
	 *
	 * @covers Ryte_Integration::add_weekly_schedule
	 */
	public function test_add_weekly_schedule_with_invalid_filter_input() {
		// Runs with default priority 10.
		add_filter( 'cron_schedules', [ $this->class_instance, 'add_weekly_schedule' ] );

		// Runs earlier, with priority 1.
		add_filter( 'cron_schedules', '__return_false', 1 );

		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );

		remove_filter( 'cron_schedules', '__return_false', 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (1).
	 *
	 * @covers Ryte_Integration::fetch_from_ryte
	 */
	public function test_fetch_from_ryte() {
		update_option( 'home', 'http://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = $this->class_instance->get_option();
		$this->assertEquals( $option_instance->get_status(), 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0).
	 *
	 * @covers Ryte_Integration::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_not_indexable() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = $this->class_instance->get_option();
		$this->assertEquals( $option_instance->get_status(), 0 );
	}

	/**
	 * Test if the method can only be called once because of the fetch limit of 15 seconds.
	 *
	 * @covers Ryte_Integration::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_call_twice() {
		update_option( 'home', 'http://example.org' );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );
		$this->assertFalse( $this->class_instance->fetch_from_ryte() );
	}

	/**
	 * Tests if not active is based on the option.
	 *
	 * @covers Ryte_Integration::is_active
	 */
	public function test_is_not_active() {
		$this->options_helper->set( 'ryte_indexability', false );

		$this->assertFalse( $this->class_instance->is_active() );
	}

	/**
	 * Tests if active is based on the option.
	 *
	 * @covers Ryte_Integration::is_active
	 */
	public function test_is_active() {
		$this->options_helper->set( 'ryte_indexability', true );

		$this->assertTrue( $this->class_instance->is_active() );
	}

	/**
	 * Tests if the cronjob is scheduled when enabled.
	 *
	 * @covers Ryte_Integration::activate_hooks
	 * @covers Ryte_Integration::schedule_cron
	 * @covers Ryte_Integration::unschedule_cron
	 */
	public function test_cron_scheduling() {
		$this->options_helper->set( 'ryte_indexability', true );

		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		$instance = new Ryte_Integration( $this->options_helper );
		$instance->activate_hooks();

		$this->assertNotFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		// Disable the option.
		$this->options_helper->set( 'ryte_indexability', false );

		$instance->activate_hooks();

		// The cron should be removed.
		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );
	}
}
