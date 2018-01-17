<?php
/**
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 */
class WPSEO_Extension_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Extension_Manager_Double
	 */
	private $class_instance;

	/**
	 * Set up a WPSEO_Extension_Manager object.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		// Create instance of WPSEO_Twitter class.
		require_once WPSEO_TESTS_PATH . 'doubles/class-extension-manager-double.php';
	}

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Extension_Manager_Double();
	}

	/**
	 * Tests the scenario when no active extensions are loaded.
	 */
	public function test_has_no_active_extensions_loaded() {
		$mock = $this
			->getMockBuilder( 'WPSEO_Extension_Manager' )
			->setMethods( array( 'get_current_page', 'get_active_extensions', 'set_cached_extensions', 'get_cached_extensions' ) )
			->getMock();

		$mock
			->expects( $this->once() )
			->method( 'get_current_page' )
			->will( $this->returnValue( 'wpseo_titles' ) );

		$mock
			->expects( $this->once() )
			->method( 'get_cached_extensions' )
			->will( $this->returnValue( array( 'wordpress-seo-premium' ) ) );

		$mock
			->expects( $this->once() )
		    ->method( 'set_cached_extensions' )
			->with( $this->identicalTo( array( 'wordpress-seo-premium' ) ) );

		$this->assertTrue( $mock->is_activated( 'wordpress-seo-premium' ) );

	}
}
