<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\OnPage
 */

/**
 * Unit Test Class.
 */
class WPSEO_OnPage_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_OnPage
	 */
	protected $class_instance;

	/**
	 * @var WPSEO_OnPage_Option
	 */
	private $option_instance;

	/**
	 * Setup the class instance
	 */
	public function setUp() {
		parent::setUp();

		$this->option_instance = new WPSEO_OnPage_Option();
		$this->class_instance  = new WPSEO_OnPage_Double();
	}

	/**
	 * Test if the weekly schedule is added to wp_get_schedules
	 *
	 * @covers WPSEO_OnPage::add_weekly_schedule
	 */
	public function test_add_weekly_schedule() {
		$this->class_instance->register_hooks();

		$schedules = $this->class_instance->add_weekly_schedule( array() );

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );

		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );
	}

	/**
	 * Test if the weekly schedule is added to wp_get_schedules.
	 *
	 * @see https://github.com/Yoast/wordpress-seo/issues/9450
	 * @see https://github.com/Yoast/wordpress-seo/issues/9475
	 *
	 * @covers WPSEO_OnPage::add_weekly_schedule
	 */
	public function test_add_weekly_schedule_with_invalid_filter_input() {
		$this->class_instance->register_hooks();

		add_filter( 'cron_schedules', '__return_false', 1 );

		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );

		remove_filter( 'cron_schedules', '__return_false', 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (1)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage() {
		update_option( 'home', 'http://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_onpage() );

		$option_instance = new WPSEO_OnPage_Option();
		$this->assertEquals( $option_instance->get_status(), 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage_not_indexable() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_onpage() );

		$option_instance = new WPSEO_OnPage_Option();
		$this->assertEquals( $option_instance->get_status(), 0 );
	}

	/**
	 * Test is the method can only be called once because of the fetch limit of 60 minutes
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage_call_twice() {
		update_option( 'home', 'http://example.org' );

		$this->assertTrue( $this->class_instance->fetch_from_onpage() );
		$this->assertFalse( $this->class_instance->fetch_from_onpage() );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_notify_admins() {
		update_option( 'home', 'http://example.org' );

		$class_instance =
			$this
				->getMockBuilder( 'WPSEO_OnPage_Double' )
				->setMethods( array( 'notify_admins' ) )
				->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'notify_admins' );

		$class_instance->fetch_from_onpage();
	}

	/**
	 * Tests whether OnPage is disable, the notice should not be shown.
	 *
	 * @covers WPSEO_OnPage::__construct
	 * @covers WPSEO_OnPage::should_show_notice
	 */
	public function test_show_notice_being_hooked() {
		$instance = new WPSEO_OnPage();
		$instance->register_hooks();

		$this->assertTrue( has_action( 'admin_init', array( $instance, 'show_notice' ) ) > 0 );
	}

	/**
	 * Tests whether OnPage is disable, the notice should not be shown.
	 *
	 * @covers WPSEO_OnPage::__construct
	 * @covers WPSEO_OnPage::should_show_notice
	 */
	public function test_should_show_notice_disabled() {
		$instance = new WPSEO_OnPage_Double();

		$this->assertFalse( $instance->should_show_notice() );
	}

	/**
	 * Tests whether OnPage is not indexable and enabled, the notice should be shown.
	 *
	 * @covers WPSEO_OnPage::__construct
	 * @covers WPSEO_OnPage::should_show_notice
	 */
	public function test_should_show_notice() {
		$option = new OnPage_Option_Mock( true, WPSEO_OnPage_Option::IS_NOT_INDEXABLE, true );
		update_option( 'blog_public', 1 );

		$instance = $this->getMockBuilder( 'WPSEO_OnPage_Double' )
			->setMethods( array( 'get_option' ) )
			->getMock();

		$instance->expects( $this->atLeastOnce() )
			->method( 'get_option' )
			->will( $this->returnValue( $option ) );

		$this->assertTrue( $instance->should_show_notice() );
	}

	/**
	 * Tests whether OnPage is not indexable and enabled, the notice should be shown.
	 *
	 * @covers WPSEO_OnPage::__construct
	 * @covers WPSEO_OnPage::should_show_notice
	 */
	public function test_should_not_show_notice() {
		// Disable OnPage.
		$option = new OnPage_Option_Mock( false, WPSEO_OnPage_Option::IS_NOT_INDEXABLE, true );

		// Set blog to public.
		update_option( 'blog_public', 1 );

		$instance = $this->getMockBuilder( 'WPSEO_OnPage_Double' )
			->setMethods( array( 'get_option' ) )
			->getMock();

		$instance->expects( $this->atLeastOnce() )
			->method( 'get_option' )
			->will( $this->returnValue( $option ) );

		$this->assertFalse( $instance->should_show_notice(), 'The notice should not be shown when disabled.' );
	}

	/**
	 * Tests if the notice constrol is hooked.
	 */
	public function test_notification_hooks_should_be_hooked() {
		$onpage = new WPSEO_OnPage();
		$onpage->register_hooks();

		$this->assertNotFalse( has_action( 'admin_init', array( $onpage, 'show_notice' ) ) );
	}

	/**
	 * Tests if not active is based on the option.
	 */
	public function test_is_not_active() {
		WPSEO_Options::set( 'onpage_indexability', false );

		$this->assertFalse( WPSEO_OnPage::is_active() );
	}

	/**
	 * Tests if active is baed on the option.
	 *
	 * @covers WPSEO_OnPage::is_active()
	 */
	public function test_is_active() {
		WPSEO_Options::set( 'onpage_indexability', true );

		$this->assertTrue( WPSEO_OnPage::is_active() );
	}

	/**
	 * Tests if the cronjob is scheduled when enabled.
	 *
	 * @covers WPSEO_OnPage::activate_hooks()
	 * @covers WPSEO_OnPage::schedule_cron()
	 * @covers WPSEO_OnPage::unschedule_cron()
	 */
	public function test_cron_scheduling() {
		WPSEO_Options::set( 'onpage_indexability', true );

		$this->assertFalse( wp_next_scheduled( 'wpseo_onpage_fetch' ) );

		$instance = new WPSEO_OnPage();
		$instance->activate_hooks();

		$this->assertNotFalse( wp_next_scheduled( 'wpseo_onpage_fetch' ) );

		// Disable the option.
		WPSEO_Options::set( 'onpage_indexability', false );

		$instance->activate_hooks();

		// The cron should be removed.
		$this->assertFalse( wp_next_scheduled( 'wpseo_onpage_fetch' ) );
	}
}
