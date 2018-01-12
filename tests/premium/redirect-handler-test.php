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
	 * Tests the situation where the php redirects are disabled.
	 *
	 * @covers WPSEO_Redirect_Handler::load()
	 */
	public function test_load_with_php_redirects_disabled() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'load_php_redirects' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( false ) );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->load();
	}

	/**
	 * Tests the situation where a normal redirect has been matched.
	 *
	 * @covers WPSEO_Redirect_Handler::load()
	 */
	public function test_load_with_a_matching_normal_redirect() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'load_php_redirects', 'get_request_uri', 'do_redirect', 'get_redirects' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( '/normal/redirect' ) );

		$redirect_handler
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( true ) );

		$redirect_handler->expects( $this->once() )->method( 'do_redirect' );

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_redirects' )
			->will(
				$this->returnValue(
					array(
						'normal/redirect/' => array(
							'url'  => '/',
							'type' => 403,
						)
					)
				)
			);

		$redirect_handler->load();
	}

	/**
	 * Tests the situation where a regex redirect is matched.
	 *
	 * @covers WPSEO_Redirect_Handler::load()
	 *
	 * @group redirects
	 */
	public function test_load_with_a_matching_regex_redirect() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'load_php_redirects', 'get_request_uri', 'do_redirect', 'get_redirects' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'regex/redirect' ) );

		$redirect_handler
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( true ) );

		$redirect_handler->expects( $this->once() )->method( 'do_redirect' );

		$redirect_handler
			->expects( $this->exactly( 2 ) )
			->method( 'get_redirects' )
			->will(
				$this->onConsecutiveCalls(
					array(
						'normal/redirect/' => array(
							'url'  => '/',
							'type' => 403,
						)
					),
					array(
						'(reg)ex/redirect' => array(
							'url'  => '/',
							'type' => 403,
						)
					)
				)
			);

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->load();
	}

	/**
	 * Tests the formatting of a regex redirect url with an actual match.
	 *
	 * @covers WPSEO_Redirect_Handler::format_regex_redirect_url()
	 */
	public function test_format_regex_redirect_url_with_a_match() {
		$class_instance = new WPSEO_Redirect_Handler_Double();

		$class_instance->set_url_matches(
			array(
				'page/redirect/me',
				'redirect',
				'me',
			)
		);

		$this->assertEquals( 'redirect', $class_instance->format_regex_redirect_url( array( '$1' ) ) );
	}

	/**
	 * Tests the formatting of a regex redirect url without an actual match.
	 *
	 * @covers WPSEO_Redirect_Handler::format_regex_redirect_url()
	 *
	 * @group test
	 */
	public function test_format_regex_redirect_url_without_a_match() {
		$class_instance = new WPSEO_Redirect_Handler();

		$this->assertEquals( '', $class_instance->format_regex_redirect_url( array( '$1' ) ) );
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
	public function test_handle_normal_redirects( $request_uri, WPSEO_Redirect $redirect ) {
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
			->method( 'do_redirect' )
			->with( $this->identicalTo( $redirect->get_target() ), $this->identicalTo( $redirect->get_type() ) );

		$class_instance->handle_normal_redirects( rawurldecode( $request_uri ) );
	}

	/**
	 * Tests the handling of regex redirects.
	 *
	 * @dataProvider regex_redirect_provider
	 *
	 * @param string         $request_uri  The requested uri.
	 * @param WPSEO_Redirect $redirect     The redirect object.
	 * @param string         $final_target The final target.
	 *
	 * @covers WPSEO_Redirect_Handler::handle_regex_redirects()
	 * @covers WPSEO_Redirect_Handler::match_regex_redirect()
	 */
	public function test_handle_regex_redirects( $request_uri, WPSEO_Redirect $redirect, $final_target ) {
		$redirects = array(
			$redirect->get_origin() => array(
				'url'  => $redirect->get_target(),
				'type' => $redirect->get_type(),
			),
		);
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_request_uri', 'get_redirects', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( rawurldecode( $request_uri ) ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_redirects' )
			->will( $this->returnValue( $redirects ) );

		$class_instance
			->expects( $this->once() )
			->method( 'do_redirect' )
			->with( $this->identicalTo( $final_target ), $this->identicalTo( $redirect->get_type() ) );

		/** @var WPSEO_Redirect_Handler_Double $class_instance */
		$class_instance->set_request_url();
		$class_instance->handle_regex_redirects();
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

	/**
	 * Provider for the default (normal) redirects.
	 *
	 * The format for each record is:
	 * [0] string:         The request url.
	 * [1] WPSEO_Redirect: The redirect object.
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
	 * Provider for the default (normal) redirects.
	 *
	 * The format for each record is:
	 * [0] string:         The request url.
	 * [1] WPSEO_Redirect: The redirect object.
	 * [2] string:         The target with the replaced values.
	 *
	 * @returns array List with redirects.
	 */
	public function regex_redirect_provider() {
		return array(
			array(
				'page/get/me',
				new WPSEO_Redirect( 'page/(get|redirect)/(me)', 'page-$1-$2', 301 ),
				'page-get-me',
			),
			array(
				'page/redirect/me',
				new WPSEO_Redirect( 'page/(get|redirect)/(me)', 'page-$1-$2', 301 ),
				'page-redirect-me',
			),
			array(
				'page/get/it',
				new WPSEO_Redirect( 'page/.*', 'page-hi', 301 ),
				'page-hi'

			)
		);
	}

}
