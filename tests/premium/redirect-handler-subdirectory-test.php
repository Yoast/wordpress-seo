<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing the redirect handler with subdirectory installation.
 *
 * @group redirects
 */
class WPSEO_Redirect_Handler_Subdirectory_Test extends WPSEO_UnitTestCase {

	/**
	 * Original value of the `home` option.
	 *
	 * @var string
	 */
	protected $old_home;

	/**
	 * Sets the home option to a path with a subdirectory.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->old_home = get_option( 'home' );
		update_option( 'home', 'http://example.org/blog' );
	}

	/**
	 * Puts back the old home option value.
	 *
	 * @return void
	 */
	public function tearDown() {
		parent::tearDown();

		update_option( 'home', $this->old_home );
	}

	/**
	 * Tests if the subdirectory is stripped from the request uri.
	 */
	public function test_get_request_uri() {
		$old_request_uri        = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
		$_SERVER['REQUEST_URI'] = 'blog/page';

		$handler = new WPSEO_Redirect_Handler_Double();
		$this->assertEquals( '/page', $handler->get_request_uri() );

		$_SERVER['REQUEST_URI'] = $old_request_uri;
	}

	/**
	 * Parses the home url with a sub directory being set.
	 */
	public function test_parse_target_url() {
		$redirect = new WPSEO_Redirect( 'origin', 'blog/redirect' );
		$handler  = new WPSEO_Redirect_Handler_Double();

		$this->assertEquals(
			'http://example.org/blog/redirect',
			$handler->parse_target_url( $redirect->get_target() )
		);
	}
}
