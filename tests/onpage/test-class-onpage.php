<?php
/**
* @package WPSEO\Unittests
*/

class WPSEO_OnPage_Double extends WPSEO_OnPage {

	/**
	 * Overwrite the request_indexibility method, because it uses a dependency
	 *
	 * @return int
	 */
	protected function request_indexability() {
		if ( home_url() === 'http://example.org' ) {
			return 1;
		}

		return 0;
	}

	/**
	 * Overwrite the method because is has a dependency.
	 *
	 * @param int|null $old_status The old indexable status.
	 * @param int      $new_status The new indexable status.
	 *
	 * @return bool
	 */
	protected function notify_admins( $old_status, $new_status ) {

	}

}

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
		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'],  __( 'Once Weekly' ) );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (1)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage() {

		$this->assertEquals( $this->option_instance->get( 'status' ), null );

		$this->assertTrue( $this->class_instance->fetch_from_onpage() );

		$option_instance = new WPSEO_OnPage_Option();
		$this->assertEquals( $option_instance->get( 'status' ), 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage_not_indexable() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( $this->option_instance->get( 'status' ), null );

		$this->assertTrue( $this->class_instance->fetch_from_onpage() );

		$option_instance = new WPSEO_OnPage_Option();
		$this->assertEquals( $option_instance->get( 'status' ), 0 );
	}

	/**
	 * Test is the method can only be called once because of the fetch limit of 60 minutes
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_fetch_from_onpage_call_twice() {
		$this->assertTrue( $this->class_instance->fetch_from_onpage() );
		$this->assertFalse( $this->class_instance->fetch_from_onpage() );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0)
	 *
	 * @covers WPSEO_OnPage::fetch_from_onpage
	 */
	public function test_notify_admins() {
		$class_instance =
			$this
				->getMock( 'WPSEO_OnPage_Double', array( 'notify_admins' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'notify_admins' );

		$class_instance->fetch_from_onpage();
	}

}
