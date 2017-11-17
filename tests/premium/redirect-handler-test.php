<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing the redirect handler.
 */
class WPSEO_Redirect_Handler_Test extends WPSEO_UnitTestCase {

	/**
	 * Includes the test double.
	 */
	public function setUp() {
		parent::setUp();

		require_once WPSEO_TESTS_PATH . 'premium/doubles/redirect-handler-double.php';
	}

	/**
	 * Testing a regex redirect that will match the request URI.
	 *
	 * @covers WPSEO_Redirect_Handler::match_regex_redirect()
	 */
	public function test_a_regex_redirect_that_will_match_the_request_uri() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'load_php_redirects', 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( true ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'http://example.com/page/get/it' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'do_redirect' );

		$class_instance->load();
		$class_instance->match_regex_redirect(
			'page.*',
			array(
				'url'  => 'page-hi',
				'type' => 301,
			)
		);
	}

	/**
	 * Testing the regex redirect that will not match the request URI.
	 *
	 * @covers WPSEO_Redirect_Handler::match_regex_redirect()
	 */
	public function test_a_regex_redirect_that_will_not_match_the_request_uri() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'load_php_redirects', 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( true ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'http://example.com/page/get/it' ) );

		$class_instance
			->expects( $this->never() )
			->method( 'do_redirect' );

		$class_instance->load();
		$class_instance->match_regex_redirect(
			'paige.*',
			array(
				'url'  => 'page-hi',
				'type' => 301,
			)
		);
	}

	/**
	 * Test load PHP redirects for non-existing option.
	 *
	 * @covers WPSEO_Redirect_Handler::load_php_redirects()
	 */
	public function test_load_php_redirects() {
		delete_option( 'wpseo_redirect' );

		$class_instance = new WPSEO_Redirect_Handler_Double();
		$this->assertTrue( $class_instance->load_php_redirects() );
	}

	/**
	 * Test load PHP redirects for existing option with redirects not disabled.
	 *
	 * @covers WPSEO_Redirect_Handler::load_php_redirects()
	 */
	public function test_load_php_redirects_option_set_not_disabled() {
		update_option( 'wpseo_redirect', array( 'disable_php_redirect' => 'off' ) );

		$class_instance = new WPSEO_Redirect_Handler_Double();
		$this->assertTrue( $class_instance->load_php_redirects() );

		delete_option( 'wpseo_redirect' );
	}

	/**
	 * Test load PHP redirects for existing option with PHP redirects disabled.
	 *
	 * @covers WPSEO_Redirect_Handler::load_php_redirects()
	 */
	public function test_load_php_redirects_option_set_disabled() {
		update_option( 'wpseo_redirect', array( 'disable_php_redirect' => 'on' ) );

		$class_instance = new WPSEO_Redirect_Handler_Double();
		$this->assertFalse( $class_instance->load_php_redirects() );

		delete_option( 'wpseo_redirect' );
	}
}
