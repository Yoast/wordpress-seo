<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for the redirect option class
 *
 * @covers WPSEO_Redirect_Option
 */
class WPSEO_Redirect_Option_Test extends WPSEO_UnitTestCase {

	/**
	 * This variable is instantiated in setUp().
	 *
	 * @var WPSEO_Redirect_Option
	 */
	protected $class_instance;

	/**
	 * Setting the instance
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Redirect_Option();
		$this->class_instance->set_format( WPSEO_Redirect::FORMAT_PLAIN );
		$this->class_instance->add( 'old-url', 'new-url', 301 );
		$this->class_instance->save();
	}

	/**
	 * Remove the option on tear down.
	 */
	public function tearDown() {
		// Clear the option to be sure there are no redirects.
		delete_option( WPSEO_Redirect_Option::OPTION );
	}

	/**
	 * Test the result of the get_all method. Should return an empty array
	 *
	 * @covers WPSEO_Redirect::get_all
	 */
	public function test_get_all() {
		$this->assertEquals(
			array(
				new WPSEO_Redirect( 'old-url', 'new-url', 301, WPSEO_Redirect::FORMAT_PLAIN ),
			),
			$this->class_instance->get_all()
		);
	}

	/**
	 * Test adding a new redirect and add the same one also, to check if this one will be skipped
	 *
	 * @covers WPSEO_Redirect::add
	 */
	public function test_add() {
		$this->assertTrue( is_a( $this->class_instance->add( 'new-redirect', 'new-target', 301 ), 'WPSEO_Redirect' ) );
		$this->assertFalse( $this->class_instance->add( 'old-url', 'new-url', 301 ) );
	}

	/**
	 * Test updating a redirect and update another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect::update
	 */
	public function test_update() {
		$this->assertTrue( is_a( $this->class_instance->update( 'old-url', 'older-url', 'older-target', 301 ), 'WPSEO_Redirect' ) );
		$this->assertFalse( $this->class_instance->update( 'does-not-exists', 'old-target', 'new-target', 301 ) );
	}

	/**
	 * Test deleting a redirect and delete another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect::delete
	 */
	public function test_delete() {
		$this->assertTrue( $this->class_instance->delete( 'old-url' ) );
		$this->assertFalse( $this->class_instance->delete( 'does-not-exists' ) );
	}

	/**
	 * Test if searching for a redirect is working
	 *
	 * @covers WPSEO_Redirect::search
	 */
	public function test_search() {
		$this->assertEquals( 0, $this->class_instance->search( 'old-url' ) );
		$this->assertFalse( $this->class_instance->search( 'does-not-exist' ) );
	}

}
