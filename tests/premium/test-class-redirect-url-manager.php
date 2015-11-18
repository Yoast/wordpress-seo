<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the url redirect manager
 *
 * @covers WPSEO_Redirect_URL_Manager
 */
class WPSEO_URL_Redirect_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_URL_Manager
	 */
	protected $class_instance;

	/**
	 * Setting up the class instance and fill it with some fake redirects
	 */
	public function setUp() {

		$this->class_instance = new WPSEO_Redirect_Manager();

		$this->class_instance->create_redirect( new WPSEO_Redirect( 'old', 'new', 301 ) );
		$this->class_instance->create_redirect( new WPSEO_Redirect( 'older', 'newer', 301 ) );
		$this->class_instance->create_redirect( new WPSEO_Redirect( 'oldest', 'newest', 301 ) );
	}

	/**
	 * Check if the redirects are filled
	 *
	 * @covers WPSEO_Redirect_URL_Manager::get_redirects
	 */
	public function test_get_redirects() {
		$redirects = $this->class_instance->get_redirects();


		$this->assertEquals( '/old',    $redirects[0]->get_origin() );
		$this->assertEquals( '/older',  $redirects[1]->get_origin() );
		$this->assertEquals( '/oldest', $redirects[2]->get_origin() );
	}

	/**
	 * Testing if redirect is added, if redirecs contains the added redirect and if the contained redirect is what is just added
	 *
	 * @covers WPSEO_Redirect_URL_Manager::create_redirect
	 */
	public function test_add_redirect() {

		$redirect = new WPSEO_Redirect( 'add_redirect', 'added_redirect', 301 );

		$this->assertTrue( $this->class_instance->create_redirect( $redirect ) );

		$this->assertEquals( '/add_redirect', $redirect->get_origin() );
		$this->assertEquals( '/added_redirect', $redirect->get_target() );
		$this->assertEquals( '301', $redirect->get_type() );

		/*
		 Because of PHP 5.2, this can not be done
		 $this->assertArraySubset( array( 'add_redirect' => array( 'url' => 'added_redirect', 'type' => 301 ) ), $redirects );
		 */

		// This redirect already exists, so it returns false.
		$this->assertFalse( $this->class_instance->create_redirect( new WPSEO_Redirect( 'old', 'is_new', 301 ) ) );
	}

	/**
	 * Test what happens if we update the redirect
	 *
	 * @covers WPSEO_Redirect_URL_Manager::create_redirect
	 * @covers WPSEO_Redirect_URL_Manager::update_redirect
	 */
	public function test_update_redirect() {
		// Create a redirect.
		$redirect = new WPSEO_Redirect( 'update_redirect', 'updated_redirect', 301 );

		$this->assertTrue( $this->class_instance->create_redirect( $redirect ) );
		$this->assertEquals( '/update_redirect', $redirect->get_origin() );
		$this->assertEquals( '/updated_redirect', $redirect->get_target() );
		$this->assertEquals( '301', $redirect->get_type() );

		// Update the created redirect.
		$redirect = new WPSEO_Redirect( 'redirect_update', 'updated_redirect', 301 );

		$this->assertTrue( $this->class_instance->update_redirect( 'update_redirect', $redirect ) );

		$this->assertEquals( '/redirect_update', $redirect->get_origin() );
		$this->assertEquals( '/updated_redirect', $redirect->get_target() );
		$this->assertEquals( '301', $redirect->get_type() );

		/*
		 	When 5.2 support is dropped we can use this fancy testmethod:
			$this->assertArraySubset( array( '/redirect_update' => array( 'url' => 'updated_redirect', 'type' => 301 ) ), $this->class_instance->get_redirects() );
		 */

	}

	/**
	 * Test removing a redirect
	 *
	 * @covers WPSEO_Redirect_URL_Manager::delete_redirects
	 */
	public function test_delete_redirect() {
		// First of all create a redirect.
		$this->class_instance->create_redirect( new WPSEO_Redirect( 'delete_redirect', 'deleted_redirect' ), 301 );

		// Remove the redirect.
		$this->assertTrue( $this->class_instance->delete_redirects( array( 'delete_redirect' ) ) );

		// Cannot remove a redirect that doesn't exists anymore.
		$this->assertFalse( $this->class_instance->delete_redirects( array( 'delete_redirect' ) ) );
	}

	/**
	 * Unset the class instance
	 */
	public function tearDown() {
		// Clear the option to be sure there are no redirects.
		delete_option( WPSEO_Redirect_Option::OPTION );

		$this->class_instance = null;
	}

}
