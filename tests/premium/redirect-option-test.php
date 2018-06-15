<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the redirect option class
 *
 * @covers WPSEO_Redirect_Option
 *
 * @group redirects
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

		$this->class_instance->add( new WPSEO_Redirect( 'old-url', 'new-url', 301 ) );
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
	 * @covers WPSEO_Redirect_Option::get_all
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
	 * @covers WPSEO_Redirect_Option::add
	 */
	public function test_add() {
		$this->assertTrue( $this->class_instance->add( new WPSEO_Redirect( 'new-redirect', 'new-target', 301 ) ) );
		$this->assertFalse( $this->class_instance->add( new WPSEO_Redirect( 'old-url', 'new-url', 301 ) ) );
	}

	/**
	 * Test updating a redirect and update another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect_Option::update
	 */
	public function test_update() {
		$old_redirect = new WPSEO_Redirect( 'old-url', 'older-target', 301 );
		$non_existing = new WPSEO_Redirect( 'does-not-exists', 'older-target', 301 );

		$this->assertTrue( $this->class_instance->update( $old_redirect, new WPSEO_Redirect( 'older-url', 'older-target', 301 ) ) );
		$this->assertFalse( $this->class_instance->update( $non_existing, new WPSEO_Redirect( 'old-target', 'new-target', 301 ) ) );
	}

	/**
	 * Test deleting a redirect and delete another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect_Option::delete
	 */
	public function test_delete() {
		$this->assertTrue( $this->class_instance->delete( new WPSEO_Redirect( 'old-url', 'older-target', 301 ) ) );
		$this->assertFalse( $this->class_instance->delete( new WPSEO_Redirect( 'does-not-exists', 'older-target', 301 ) ) );
	}

	/**
	 * Test if searching for a redirect is working
	 *
	 * @covers WPSEO_Redirect_Option::search
	 */
	public function test_search() {
		$this->assertEquals( 0, $this->class_instance->search( 'old-url', WPSEO_Redirect::FORMAT_PLAIN ) );
		$this->assertFalse( $this->class_instance->search( 'does-not-exist', WPSEO_Redirect::FORMAT_PLAIN ) );
	}

	/**
	 * Checks if the redirect modified action method will be called when adding a redirect.
	 *
	 * @covers WPSEO_Redirect_Option::add
	 */
	public function test_run_redirects_modified_action_on_add() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search', 'run_redirects_modified_action' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'search' )
			->will( $this->returnValue( false ) );

		$class_instance
			->expects( $this->once() )
			->method( 'run_redirects_modified_action' );

		$redirect = new WPSEO_Redirect( 'origin', 'target' );

		// First of all create a redirect.
		$class_instance->add( $redirect );
	}

	/**
	 * Checks if the redirect modified action method will be called when updating a redirect.
	 *
	 * @covers WPSEO_Redirect_Option::update
	 */
	public function test_run_redirects_modified_action_on_edit() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search', 'run_redirects_modified_action' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'search' )
			->will( $this->returnValue( 'found' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'run_redirects_modified_action' );

		$redirect = new WPSEO_Redirect( 'origin', 'target' );

		// First of all create a redirect.
		$class_instance->update( $redirect, $redirect );
	}

	/**
	 * Checks if the redirect modified action method will be called when deleting a redirect.
	 *
	 * @covers WPSEO_Redirect_Option::update
	 */
	public function test_run_redirects_modified_action_on_delete() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search', 'run_redirects_modified_action' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'search' )
			->will( $this->returnValue( 'found' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'run_redirects_modified_action' );

		$redirect = new WPSEO_Redirect( 'origin', 'target' );

		// First of all create a redirect.
		$class_instance->delete( $redirect );
	}

}
