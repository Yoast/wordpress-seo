<?php
/**
 * WPSEO plugin test file.
 *
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
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Extension_Manager_Double();
	}

	/**
	 * Tests the scenario when no active extensions are loaded.
	 *
	 * @covers WPSEO_Extension_Manager::is_activated()
	 */
	public function test_has_no_active_extensions_loaded() {
		$extension_manager = $this
			->getMockBuilder( 'WPSEO_Extension_Manager' )
			->setMethods( array( 'get_current_page', 'get_active_extensions', 'set_cached_extensions', 'get_cached_extensions' ) )
			->getMock();

		$extension_manager
			->expects( $this->once() )
			->method( 'get_current_page' )
			->will( $this->returnValue( 'wpseo_titles' ) );

		$extension_manager
			->expects( $this->once() )
			->method( 'get_cached_extensions' )
			->will( $this->returnValue( array( 'wordpress-seo-premium' ) ) );

		$this->assertTrue( $extension_manager->is_activated( 'wordpress-seo-premium' ) );
	}

	/**
	 * Tests the scenario when no active extensions are loaded and the cache is considered faulty.
	 *
	 * @covers WPSEO_Extension_Manager::is_activated()
	 */
	public function test_has_no_active_extensions_loaded_and_cached_are_faulty() {

		// Reset the active extensions.
		$this->class_instance->set_active_extensions( null );

		$extension_manager = $this
			->getMockBuilder( 'WPSEO_Extension_Manager' )
			->setMethods(
				array(
					'get_current_page',
					'get_active_extensions',
					'set_cached_extensions',
					'get_cached_extensions',
					'retrieve_active_extensions',
				)
			)
			->getMock();

		$extension_manager
			->expects( $this->once() )
			->method( 'get_current_page' )
			->will( $this->returnValue( 'wpseo_titles' ) );

		$extension_manager
			->expects( $this->once() )
			->method( 'get_cached_extensions' )
			->will( $this->returnValue( '' ) );

		$extension_manager
			->expects( $this->once() )
			->method( 'retrieve_active_extensions' )
			->will( $this->returnValue( array( 'wordpress-seo-premium' ) ) );

		$extension_manager
			->expects( $this->once() )
			->method( 'set_cached_extensions' )
			->with( $this->identicalTo( array( 'wordpress-seo-premium' ) ) );

		$this->assertTrue( $extension_manager->is_activated( 'wordpress-seo-premium' ) );
	}
}
