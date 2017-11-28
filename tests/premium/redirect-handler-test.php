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
	 * Tests the handling of normal redirects.
	 *
	 * @dataProvider normal_redirect_provider
	 *
	 * @param string         $request_uri The requested uri.
	 * @param WPSEO_Redirect $redirect    The redirect object.
	 *
	 * @covers WPSEO_Redirect_Handler::handle_normal_redirects
	 */
	public function test_redirect_handling( $request_uri, WPSEO_Redirect $redirect ) {
		$redirects = array(
			$redirect->get_origin() => array(
				'url'  => $redirect->get_target(),
				'type' => $redirect->get_type(),
			),
		);

		/** @var WPSEO_Redirect_Handler_Double $class_instance */
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_redirects', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_redirects' )
			->will( $this->returnValue( $redirects ) );

		$class_instance
			->expects( $this->once() )
			->method( 'do_redirect' );

		$class_instance->handle_normal_redirects( rawurldecode( $request_uri ) );
	}

	/**
	 * Provider for the default redirects.
	 *
	 * @returns array List with redirects.
	 */
	public function normal_redirect_provider() {
		return array(
			array(
				'example-page',
				new WPSEO_Redirect( 'example-page', '/', 301 ),
			),
			array(
				'some url with spaces',
				new WPSEO_Redirect( 'some url with spaces', '/', 301 ),
			),

			array(
				'דף לדוגמה',
				new WPSEO_Redirect( 'דף לדוגמה', '/', 301 ),
			),

			// For reference, see: https://github.com/Yoast/wordpress-seo-premium/issues/1451.
			array(
				'Cellgevity%20support',
				new WPSEO_Redirect( 'Cellgevity support', '/', 301 ),
			),
			array(
				'Cellgevity support',
				new WPSEO_Redirect( 'Cellgevity%20support', '/', 301 ),
			),
			// For reference, see: https://github.com/Yoast/wordpress-seo-premium/issues/758.
			array(
				'jaarverslagen/2009/Jaarverslag 2009.pdf',
				new WPSEO_Redirect( 'jaarverslagen/2009/Jaarverslag%202009.pdf', '/', 301 ),
			),
			array(
				'jaarverslagen/2009/Jaarverslag%202009.pdf',
				new WPSEO_Redirect( 'jaarverslagen/2009/Jaarverslag 2009.pdf', '/', 301 ),
			),
		);
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
