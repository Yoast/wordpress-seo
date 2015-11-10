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
		$this->class_instance = new WPSEO_Redirect_URL_Manager();

		$this->class_instance->create_redirect( 'old', 'new', 301 );
		$this->class_instance->create_redirect( 'older', 'newer', 301 );
		$this->class_instance->create_redirect( 'oldest', 'newest', 301 );
	}

	/**
	 * Testing if we get the options
	 *
	 * @covers WPSEO_Redirect_URL_Manager::get_options
	 */
	public function test_get_options() {
		$options = WPSEO_Redirect_Page::get_options();

		$this->assertEquals( 'off', $options['disable_php_redirect'] );
		$this->assertEquals( 'off', $options['separate_file'] );

		/*
		 Because of PHP 5.2, this can not be done
	 	 $this->assertArraySubset(
			array( 'disable_php_redirect' => 'off', 'separate_file' => 'off' ),
			WPSEO_Redirect_Manager::get_options()
		);
		 */
	}

	/**
	 * Check if the redirects are filled
	 *
	 * @covers WPSEO_Redirect_URL_Manager::get)redirects
	 */
	public function test_get_redirects() {
		$redirects = $this->class_instance->get_redirects();

		$this->assertArrayHasKey( '/old', $redirects );
		$this->assertArrayHasKey( '/older', $redirects );
		$this->assertArrayHasKey( '/oldest', $redirects );
	}

	/**
	 * Testing if redirect is added, if redirecs contains the added redirect and if the contained redirect is what is just added
	 *
	 * @covers WPSEO_Redirect_URL_Manager::create_redirect
	 */
	public function test_add_redirect() {

		$is_created = $this->class_instance->create_redirect( 'add_redirect', 'added_redirect', 301 );
		$redirects  = $this->class_instance->get_redirects();

		$this->assertTrue( is_array( $is_created ) );
		$this->assertArrayHasKey( '/add_redirect', $redirects );

		$this->assertEquals( 'added_redirect', $redirects['/add_redirect']['url'] );
		$this->assertEquals( '301', $redirects['/add_redirect']['type'] );

		/*
		 Because of PHP 5.2, this can not be done
		 $this->assertArraySubset( array( 'add_redirect' => array( 'url' => 'added_redirect', 'type' => 301 ) ), $redirects );
		 */

		// This redirect already exists, so it returns false.
		$this->assertFalse( $this->class_instance->create_redirect( 'old', 'is_new', 301 ) );
	}

	/**
	 * Test what happens if we update the redirect
	 *
	 * @covers WPSEO_Redirect_URL_Manager::update_redirect
	 */
	public function test_update_redirect() {
		// First of all create a redirect.
		$this->class_instance->create_redirect( 'update_redirect', 'updated_redirect', 301 );

		$this->class_instance->update_redirect(
			'update_redirect',
			array( 'key' => 'redirect_update', 'value' => 'updated_redirect', 'type' => 301 )
		);

		$redirects = $this->class_instance->get_redirects();

		$this->assertEquals( 'updated_redirect', $redirects['/redirect_update']['url'] );
		$this->assertEquals( '301', $redirects['/redirect_update']['type'] );

		/*
		 	When 5.2 support is dropped we can use this fancy testmethod:
			$this->assertArraySubset( array( '/redirect_update' => array( 'url' => 'updated_redirect', 'type' => 301 ) ), $this->class_instance->get_redirects() );
		 */

	}

	/**
	 * Test removing a redirect
	 *
	 * @covers WPSEO_Redirect_URL_Manager::delete_redirect
	 */
	public function test_delete_redirect() {
		// First of all create a redirect.
		$this->class_instance->create_redirect( 'delete_redirect', 'deleted_redirect', 301 );

		// Remove the redirect.
		$this->class_instance->delete_redirects( array( 'delete_redirect' ) );

		$this->assertFalse( array_key_exists( '/delete_redirect', $this->class_instance->get_redirects() ) );
	}

	/**
	 * Test if result of get_validator is an instance of WPSEO_Redirect_URL_Validator
	 *
	 * @covers WPSEO_Redirect_URL_Manager::get_validator
	 */
	public function test_get_validator() {
		$this->assertTrue( is_a( $this->class_instance->get_validator(), 'WPSEO_Redirect_URL_Validator' ) );
	}

	/**
	 * Unset the class instance
	 */
	public function tearDown() {
		$this->class_instance = null;
	}

}
