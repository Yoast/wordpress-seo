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
class WPSEO_Ryte_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Ryte
	 */
	protected $class_instance;

	/**
	 * Holds the instance of the option related to the class being tested.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	private $option_instance;

	/**
	 * Setup the class instance.
	 */
	public function set_up() {
		parent::set_up();

		$this->option_instance = new WPSEO_Ryte_Option();
		$this->class_instance  = new WPSEO_Ryte_Double();
	}

	/**
	 * Test if the weekly schedule exists.
	 *
	 * @covers WPSEO_Ryte::maybe_add_weekly_schedule
	 * @covers WPSEO_Ryte::add_weekly_schedule
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
	 * @covers WPSEO_Ryte::add_weekly_schedule
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
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte() {
		update_option( 'home', 'http://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = new WPSEO_Ryte_Option();
		$this->assertEquals( $option_instance->get_status(), 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0).
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_not_indexable() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = new WPSEO_Ryte_Option();
		$this->assertEquals( $option_instance->get_status(), 0 );
	}

	/**
	 * Test if the method can only be called once because of the fetch limit of 15 seconds.
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_call_twice() {
		update_option( 'home', 'http://example.org' );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );
		$this->assertFalse( $this->class_instance->fetch_from_ryte() );
	}

	/**
	 * Tests if not active is based on the option.
	 *
	 * @covers WPSEO_Ryte::is_active
	 */
	public function test_is_not_active() {
		WPSEO_Options::set( 'ryte_indexability', false );

		$this->assertFalse( WPSEO_Ryte::is_active() );
	}

	/**
	 * Tests if active is based on the option.
	 *
	 * @covers WPSEO_Ryte::is_active
	 */
	public function test_is_active() {
		WPSEO_Options::set( 'ryte_indexability', true );

		$this->assertTrue( WPSEO_Ryte::is_active() );
	}

	/**
	 * Tests if the cronjob is scheduled when enabled.
	 *
	 * @covers WPSEO_Ryte::activate_hooks
	 * @covers WPSEO_Ryte::schedule_cron
	 * @covers WPSEO_Ryte::unschedule_cron
	 */
	public function test_cron_scheduling() {
		WPSEO_Options::set( 'ryte_indexability', true );

		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		$instance = new WPSEO_Ryte();
		$instance->activate_hooks();

		$this->assertNotFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		// Disable the option.
		WPSEO_Options::set( 'ryte_indexability', false );

		$instance->activate_hooks();

		// The cron should be removed.
		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );
	}
}
