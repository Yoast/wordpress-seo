<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Banner
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Banner_Sidebar_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Admin_Banner_Sidebar */
	protected $admin_banner_sidebar;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->admin_banner_sidebar = new WPSEO_Admin_Banner_Sidebar( 'test-title', new WPSEO_Admin_Banner_Renderer() );
	}

	/**
	 * Returns a mock from the WPSEO_Admin_Banner_Sidebar.
	 *
	 * @param array $methods_to_mock Array of method names.
	 *
	 * @return WPSEO_Admin_Banner_Sidebar
	 */
	public function getSidebarMock( array $methods_to_mock ) {
		return $this->getMockBuilder( 'WPSEO_Admin_Banner_Sidebar' )
			->setConstructorArgs( array( 'test', new WPSEO_Admin_Banner_Renderer() ) )
			->setMethods( $methods_to_mock )
			->getMock();
	}


	/**
	 * Tests the constructor by checking if the title is set properly.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::__construct
	 */
	public function test_constructor() {
		$admin_banner_sidebar = new WPSEO_Admin_Banner_Sidebar( 'test-title', new WPSEO_Admin_Banner_Renderer() );

		$this->assertEquals( 'test-title', $admin_banner_sidebar->get_title() );
	}

	/**
	 * Test the getting of the title.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_title
	 */
	public function test_get_title() {
		$this->assertEquals( 'test-title', $this->admin_banner_sidebar->get_title() );
	}

	/**
	 * Tests the initialization of the sidebar.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::initialize
	 * @covers WPSEO_Admin_Banner_Sidebar::add_banner_spot
	 * @covers WPSEO_Admin_Banner_Sidebar::get_premium_spot
	 * @covers WPSEO_Admin_Banner_Sidebar::get_services_spot
	 * @covers WPSEO_Admin_Banner_Sidebar::get_active_extensions
	 * @covers WPSEO_Admin_Banner_Sidebar::get_extensions_spot
	 * @covers WPSEO_Admin_Banner_Sidebar::get_courses_spot
	 * @covers WPSEO_Admin_Banner_Sidebar::get_remove_banner_spot
	 */
	public function test_initialize() {
		$this->admin_banner_sidebar->initialize( new WPSEO_Features() );
	}

	/**
	 * Tests if the banner spots are set correctly
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_banner_spots
	 */
	public function test_get_banner_spots() {
		$this->admin_banner_sidebar->initialize( new WPSEO_Features() );

		if ( ! method_exists( $this, 'assertContainsOnlyInstancesOf' ) ) {
			$this->markTestSkipped( 'Method assertContainsOnlyInstancesOf does not exist' );

			return;
		}

		$this->assertContainsOnlyInstancesOf(
			'WPSEO_Admin_Banner_Spot',
			$this->admin_banner_sidebar->get_banner_spots()
		);
	}

	/**
	 * Tests if add_banner_spot will be called.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::add_banner_spot()
	 */
	public function test_add_banner_spot() {
		$mock = $this->getSidebarMock( array( 'add_banner_spot' ) );
		$mock
			->expects( $this->any() )
			->method( 'add_banner_spot' );

		$mock->initialize( new WPSEO_Features() );
	}


	/**
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_premium_spot
	 */
	public function test_get_premium_spot_with_premium() {
		$mock = $this->getSidebarMock( array( 'get_premium_spot' ) );
		$mock
			->expects( $this->never() )
			->method( 'get_premium_spot' );

		$mock->initialize( new WPSEO_Features_Mock() );
	}

	/**
	 * Tests if the get_active_extensions is called.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_active_extensions()
	 */
	public function test_get_active_extensions() {
		$mock = $this->getSidebarMock( array( 'get_active_extensions' ) );

		$mock
			->expects( $this->once() )
			->method( 'get_active_extensions' )
			->will(
				$this->returnValue( array() )
			);

		$mock->initialize( new WPSEO_Features() );
	}

	/**
	 * Tests if the get_extensions_spot is called.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_extensions_spot()
	 */
	public function test_get_extensions_spot() {
		$mock = $this->getSidebarMock( array( 'get_extensions_spot' ) );
		$mock
			->expects( $this->once() )
			->method( 'get_extensions_spot' )
			->will(
				$this->returnValue( new WPSEO_Admin_Banner_Spot( 'get_extensions_spot' ) )
			);

		$mock->initialize( new WPSEO_Features() );
	}

	/**
	 * Tests if the get_courses_spot is called.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_courses_spot()
	 */
	public function test_get_courses_spot() {
		$mock = $this->getSidebarMock( array( 'get_courses_spot' ) );
		$mock
			->expects( $this->once() )
			->method( 'get_courses_spot' )
			->will(
				$this->returnValue( new WPSEO_Admin_Banner_Spot( 'get_courses_spot' ) )
			);

		$mock->initialize( new WPSEO_Features() );
	}

	/**
	 * Tests if the get_remove_banner_spot is called.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar::get_remove_banner_spot()
	 */
	public function test_get_remove_banner_spot() {
		$mock = $this->getSidebarMock( array( 'get_remove_banner_spot' ) );
		$mock
			->expects( $this->once() )
			->method( 'get_remove_banner_spot' )
			->will(
				$this->returnValue( new WPSEO_Admin_Banner_Spot( 'remove_banner' ) )
			);

		$mock->initialize( new WPSEO_Features() );
	}





}
