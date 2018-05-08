<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing the redirect handler.
 *
 * @group redirects
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
						),
					)
				)
			);

		$redirect_handler->load();
	}

	/**
	 * Tests the situation where a regex redirect is matched.
	 *
	 * @covers WPSEO_Redirect_Handler::load()
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
						),
					),
					array(
						'(reg)ex/redirect' => array(
							'url'  => '/',
							'type' => 403,
						),
					)
				)
			);

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->load();
	}

	/**
	 * Testing the regex redirect that will not match the request URI.
	 *
	 * @covers WPSEO_Redirect_Handler::load()
	 */
	public function test_load_with_no_matching_redirect() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'load_php_redirects', 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'no-matching/redirect' ) );

		$redirect_handler
			->expects( $this->once() )
			->method( 'load_php_redirects' )
			->will( $this->returnValue( true ) );

		$redirect_handler
			->expects( $this->never() )
			->method( 'do_redirect' );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->load();
	}

	/**
	 * Tests if the 410 page is loaded correctly.
	 *
	 * @covers WPSEO_Redirect_Handler::do_410()
	 */
	public function test_do_410() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'set_404', 'status_header' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'set_404' );

		$redirect_handler
			->expects( $this->once() )
			->method( 'status_header' )
			->with( $this->identicalTo( 410 ) );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->do_410();
	}

	/**
	 * Tests if the 451 is loaded correctly, with a template file being present.
	 *
	 * @covers WPSEO_Redirect_Handler::do_451()
	 */
	public function test_do_451() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'set_404', 'set_template_include_hook', 'status_header' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'set_template_include_hook' )
			->will( $this->returnValue( true ) );

		$redirect_handler
			->expects( $this->never() )
			->method( 'set_404' );

		$redirect_handler
			->expects( $this->once() )
			->method( 'status_header' )
			->with( $this->identicalTo( 451, 'Unavailable For Legal Reasons' ) );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->do_451();
	}

	/**
	 * Tests if the 451 is loaded correctly, without a template file being present.
	 *
	 * @covers WPSEO_Redirect_Handler::do_451()
	 */
	public function test_do_451_without_a_template_file() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'set_404', 'set_template_include_hook', 'status_header' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'set_template_include_hook' )
			->will( $this->returnValue( false ) );

		$redirect_handler
			->expects( $this->once() )
			->method( 'set_404' );

		$redirect_handler
			->expects( $this->once() )
			->method( 'status_header' )
			->with( $this->identicalTo( 451, 'Unavailable For Legal Reasons' ) );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->do_451();
	}

	/**
	 * Tests setting the page as a 404 one.
	 *
	 * @covers WPSEO_Redirect_Handler::set_404()
	 */
	public function test_set_404() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler' )
			->setMethods( array( 'get_wp_query' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_wp_query' )
			->will( $this->returnValue( new stdClass() ) );

		/** @var WPSEO_Redirect_Handler $redirect_handler */
		$redirect_handler->set_404();
	}

	/**
	 * Tests the set_template_include method where the corresponding class property has not been set.
	 *
	 * @covers WPSEO_Redirect_Handler::set_template_include()
	 */
	public function test_set_template_include_without_class_property_set() {
		$redirect_handler = new WPSEO_Redirect_Handler();

		$this->assertEquals( 'default', $redirect_handler->set_template_include( 'default' ) );
	}

	/**
	 * Tests the set_template_include method where the corresponding class property has been set.
	 *
	 * @covers WPSEO_Redirect_Handler::set_template_include()
	 */
	public function test_set_template_include_with_class_property_set() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();
		$redirect_handler->set_template_filepath( 'from-property' );

		$this->assertEquals( 'from-property', $redirect_handler->set_template_include( 'default' ) );
	}

	/**
	 * Tests the is_redirected method on default state.
	 *
	 * @covers WPSEO_Redirect_Handler::is_redirected()
	 */
	public function test_is_redirected() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertFalse( $redirect_handler->is_redirected() );
	}

	/**
	 * Tests the is_redirected method on default state.
	 *
	 * @covers WPSEO_Redirect_Handler::is_redirected()
	 */
	public function test_is_redirected_with_set_value() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();
		$redirect_handler->set_is_redirected( true );

		$this->assertTrue( $redirect_handler->is_redirected() );
	}

	/**
	 * Tests the normalization of the redirects.
	 *
	 * @covers WPSEO_Redirect_Handler::normalize_redirects()
	 */
	public function test_normalize_redirects() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$redirects = array(
			'normal/redirect/' => array(
				'url'  => '/',
				'type' => 403,
			),
		);

		$this->assertEquals( $redirects, $redirect_handler->normalize_redirects( $redirects ) );
	}

	/**
	 * Tests the setting of request url.
	 *
	 * @covers WPSEO_Redirect_Handler::set_request_url()
	 */
	public function test_set_request_url() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_request_uri' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'request_uri' ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$redirect_handler->set_request_url();
	}

	/**
	 * Tests the getting of the redirects.
	 *
	 * @covers WPSEO_Redirect_Handler::get_redirects()
	 */
	public function test_get_redirects() {
		$redirects = array(
			'wpseo-premium-redirects-export-plain' => array(
				'normal/redirect/' => array(
					'url'  => '/',
					'type' => 403,
				),
			),
			'wpseo-premium-redirects-export-regex' => array(
				'(regex)/redirect/' => array(
					'url'  => '/',
					'type' => 403,
				),
			),
		);

		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_redirects_from_options' ) )
			->getMock();

		$redirect_handler
			->expects( $this->exactly( 3 ) )
			->method( 'get_redirects_from_options' )
			->will( $this->returnValue( $redirects ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$this->assertEquals(
			$redirects['wpseo-premium-redirects-export-plain'],
			$redirect_handler->get_redirects( 'wpseo-premium-redirects-export-plain' )
		);

		$this->assertEquals(
			$redirects['wpseo-premium-redirects-export-regex'],
			$redirect_handler->get_redirects( 'wpseo-premium-redirects-export-regex' )
		);

		$this->assertEquals(
			array(),
			$redirect_handler->get_redirects( 'wpseo-premium-redirects-export-non-existing' )
		);
	}

	/**
	 * Tests the parsing of the target url.
	 *
	 * @param string $unformatted_target The unformatted (given) target.
	 * @param string $formatted_target   The formatted (expected) target.
	 *
	 * @dataProvider target_url_provider
	 *
	 * @covers WPSEO_Redirect_Handler::parse_target_url()
	 */
	public function test_parse_target_url( $unformatted_target, $formatted_target ) {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'trailingslashit', 'format_for_multisite' ) )
			->getMock();

		$redirect_handler
			->expects( $this->any() )
			->method( 'trailingslashit' )
			->will( $this->returnArgument( 0 ) );

		$redirect_handler
			->expects( $this->any() )
			->method( 'format_for_multisite' )
			->will( $this->returnArgument( 0 ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$this->assertEquals( $formatted_target, $redirect_handler->parse_target_url( $unformatted_target ) );
	}

	/**
	 * Tests the situation where the target url doesn't get a trailing slash.
	 *
	 * @covers WPSEO_Redirect_Handler::trailingslashit()
	 */
	public function test_set_trailingslashit_with_no_trailing_slash_required() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'requires_trailing_slash' ) )
			->getMock();

		$redirect_handler
			->expects( $this->any() )
			->method( 'requires_trailing_slash' )
			->will( $this->returnValue( false ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$this->assertEquals( 'redirect', $redirect_handler->trailingslashit( 'redirect' ) );
	}

	/**
	 * Tests the situation where the target url will get a trailing slash.
	 *
	 * @covers WPSEO_Redirect_Handler::trailingslashit()
	 */
	public function test_set_trailingslashit_with_trailing_slash_required() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'requires_trailing_slash' ) )
			->getMock();

		$redirect_handler
			->expects( $this->any() )
			->method( 'requires_trailing_slash' )
			->will( $this->returnValue( true ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$this->assertEquals( 'redirect/', $redirect_handler->trailingslashit( 'redirect' ) );
	}

	/**
	 * Tests the default situation when on single site.
	 *
	 * @covers WPSEO_Redirect_Handler::format_for_multisite()
	 */
	public function test_format_for_multisite_on_single_site() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertEquals( 'redirect', $redirect_handler->format_for_multisite( 'redirect' ) );
	}

	/**
	 * Tests the situation where the redirect url doesn't start with a slash.
	 *
	 * @covers WPSEO_Redirect_Handler::home_url()
	 */
	public function test_home_url_with_no_start_slash() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertEquals( home_url() . '/redirect', $redirect_handler->home_url( 'redirect' ) );
	}

	/**
	 * Tests the situation where the redirect url starts with a slash.
	 *
	 * @covers WPSEO_Redirect_Handler::home_url()
	 */
	public function test_home_url_with_start_slash() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertEquals( home_url() . '/redirect', $redirect_handler->home_url( '/redirect' ) );
	}

	/**
	 * Tests the default situation where the template file path isn't set.
	 *
	 * @covers WPSEO_Redirect_Handler::set_template_include_hook()
	 */
	public function test_set_template_include_hook() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertFalse( $redirect_handler->set_template_include_hook( 'test' ) );
	}

	/**
	 * Tests the default situation where the template file path isn't set.
	 *
	 * @covers WPSEO_Redirect_Handler::set_template_include_hook()
	 */
	public function test_set_template_include_hook_with_template() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_query_template' ) )
			->getMock();

		$redirect_handler
			->expects( $this->any() )
			->method( 'get_query_template' )
			->will( $this->returnValue( 'template-file' ) );

		$this->assertTrue( $redirect_handler->set_template_include_hook( 'test' ) );
		$this->assertEquals( 10, has_filter( 'template_include', array( $redirect_handler, 'set_template_include' ) ) );
	}

	/**
	 * Tests if return value is a wp_query.
	 *
	 * @covers WPSEO_Redirect_Handler::get_wp_query()
	 */
	public function test_get_wp_query() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertTrue( is_a( $redirect_handler->get_wp_query(), 'WP_Query' ) );
		$this->assertEquals( $GLOBALS['wp_query'], $redirect_handler->get_wp_query() );
	}

	/**
	 * Tests if return value is a wp_query.
	 *
	 * @covers WPSEO_Redirect_Handler::get_wp_query()
	 */
	public function test_get_wp_query_not_an_object() {
		$GLOBALS['wp_query'] = false;

		$redirect_handler = new WPSEO_Redirect_Handler_Double();

		$this->assertTrue( is_a( $redirect_handler->get_wp_query(), 'WP_Query' ) );
	}

	/**
	 * Tests the handling of a 410 redirect without a target.
	 *
	 * @covers WPSEO_Redirect_Handler::handle_redirect_without_target()
	 */
	public function test_handle_410_redirect_without_target() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();
		$redirect_handler->handle_redirect_without_target( 410 );

		$this->assertEquals( 10, has_action( 'wp', array( $redirect_handler, 'do_410' ) ) );
	}

	/**
	 * Tests the handling of a 451 redirect without a target.
	 *
	 * @covers WPSEO_Redirect_Handler::handle_redirect_without_target()
	 */
	public function test_handle_451_redirect_without_target() {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();
		$redirect_handler->handle_redirect_without_target( 451 );

		$this->assertEquals( 10, has_action( 'wp', array( $redirect_handler, 'do_451' ) ) );
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
	 * Tests the execution of a 451 redirect.
	 *
	 * @covers WPSEO_Redirect_Handler::do_redirect()
	 */
	public function test_do_redirect_for_a_451_redirect() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'handle_redirect_without_target', 'add_redirect_by_header', 'redirect' ) )
			->getMock();

		$redirect_handler->expects( $this->once() )->method( 'handle_redirect_without_target' );
		$redirect_handler->expects( $this->never() )->method( 'add_redirect_by_header' );
		$redirect_handler->expects( $this->never() )->method( 'redirect' );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$redirect_handler->do_redirect( 'target', 451 );
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
	 */
	public function test_format_regex_redirect_url_without_a_match() {
		$class_instance = new WPSEO_Redirect_Handler();

		$this->assertEquals( '', $class_instance->format_regex_redirect_url( array( '$1' ) ) );
	}

	/**
	 * Tests the situation where the redirect has a target.
	 *
	 * @covers WPSEO_Redirect_Handler::do_redirect()
	 */
	public function test_do_redirect_for_a_redirect_with_target() {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'add_redirect_by_header', 'redirect', 'parse_target_url' ) )
			->getMock();

		$redirect_handler->expects( $this->once() )->method( 'add_redirect_by_header' );
		$redirect_handler
			->expects( $this->once() )
			->will( $this->returnArgument( 0 ) )
			->method( 'parse_target_url' );

		$redirect_handler
			->expects( $this->once() )
			->method( 'redirect' )
			->with( $this->identicalTo( 'target' ), $this->identicalTo( 301 ) );

		/** @var WPSEO_Redirect_Handler_Double $redirect_handler */
		$redirect_handler->do_redirect( 'target', 301 );
	}

	/**
	 * Testing the regex redirect that will not match the request URI.
	 *
	 * @covers WPSEO_Redirect_Handler::match_regex_redirect()
	 */
	public function test_a_regex_redirect_that_will_not_match_the_request_uri() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'http://example.com/page/get/it' ) );

		$class_instance
			->expects( $this->never() )
			->method( 'do_redirect' );

		/** @var WPSEO_Redirect_Handler_Double $class_instance */
		$class_instance->set_request_url();
		$class_instance->match_regex_redirect(
			'paige.*',
			array(
				'url'  => 'page-hi',
				'type' => 301,
			)
		);
	}

	/**
	 * Tests the situation where search for an existing redirect.
	 *
	 * @param string       $search_needle The redirect to search for.
	 * @param string|false $expected      The expected result.
	 *
	 * @covers       WPSEO_Redirect_Handler::find_url()
	 * @covers       WPSEO_Redirect_Handler::search()
	 * @covers       WPSEO_Redirect_Handler::find_url_fallback()
	 *
	 * @dataProvider url_search_provider
	 */
	public function test_find_url( $search_needle, $expected ) {
		$redirect_handler = new WPSEO_Redirect_Handler_Double();
		$redirect_handler->set_redirects(
			array(
				'normal/redirect/' => array(
					'url'  => '/',
					'type' => 403,
				),
				'noslash' => array(
					'url'  => '/',
					'type' => 403,
				),
			)
		);

		$this->assertEquals( $expected, $redirect_handler->find_url( $search_needle ) );
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
	 * Tests the loading of the PHP Redirect with the constant having set.
	 *
	 * @runInSeparateProcess
	 *
	 * @covers WPSEO_Redirect_Handler::load_php_redirects()
	 */
	public function test_load_php_redirects_with_constant() {
		define( 'WPSEO_DISABLE_PHP_REDIRECTS', true );

		$class_instance = new WPSEO_Redirect_Handler_Double();
		$this->assertFalse( $class_instance->load_php_redirects() );
	}


	/**
	 * Tests the stripping of a subdirectory on different setups.
	 *
	 * @dataProvider strip_directory_provider
	 *
	 * @param string $home_url_path The home url path.
	 * @param string $url           The url to strip the directory from.
	 * @param string $expected      The expected value.
	 * @param string $message       Message for PHPUnit.
	 *
	 * @covers WPSEO_Redirect_Handler::strip_subdirectory()
	 */
	public function test_strip_subdirectory( $home_url_path, $url, $expected, $message ) {
		$redirect_handler = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_home_url' ) )
			->getMock();

		$redirect_handler
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( $home_url_path ) );

		/**
		 * Represents the WPSEO_Redirect_Handler_Double class.
		 *
		 * @var WPSEO_Redirect_Handler_Double $redirect_handler
		 */
		$this->assertEquals( $expected, $redirect_handler->strip_subdirectory( $url ), $message );
	}

	/* ********************* Data Providers ********************* */

	/**
	 * Provider for stripping the subdirectory from a given url.
	 *
	 * The format for each record is:
	 * [0] string: The home url path.
	 * [1] string: The url to strip the directory from.
	 * [2] string: The expected value.
	 * [3] string: Message for PHPUnit.
	 *
	 * @returns array The test data.
	 */
	public function strip_directory_provider() {
		return array(
			array( null, 'blog/page', 'blog/page', 'With no subdirectory set' ),
			array( '/blog', 'blog/page', '/page', 'With blog as subdirectory' ),
			array( '/blog', 'page', 'page', 'With a url on a higher level then subdirectory' ),
		);
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
			array(
				'redirect/to',
				new WPSEO_Redirect( 'redirect/to', '/file', 301 ),
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
				'page-hi',
			),
			array(
				'/a/page/to/amp',
				new WPSEO_Redirect( '/a/page/([^/]+)/amp', '/a/page/$1', 301 ),
				'a/page/to',
			),
		);
	}

	/**
	 * Provider for searching redirects.
	 *
	 * Format:
	 * [0] string:       Search needle.
	 * [1] string|false: Expected result.
	 *
	 * @return array
	 */
	public function url_search_provider() {
		return array(
			array(
				'normal/redirect/',
				array(
					'url'  => '/',
					'type' => 403,
				),
			),
			array(
				'normal/redirect',
				array(
					'url'  => '/',
					'type' => 403,
				),
			),
			array(
				'noslash',
				array(
					'url'  => '/',
					'type' => 403,
				),
			),
			array(
				'noslash/',
				array(
					'url'  => '/',
					'type' => 403,
				),
			),
			array( 'non/existing', false ),
			array( 'non/existing/', false ),
		);
	}

	/**
	 * Provides an array with target urls to test.
	 *
	 * Format:
	 * [0] string Unformatted target.
	 * [1] string Formatted target.
	 *
	 * @return array List with redirects.
	 */
	public function target_url_provider() {
		$home_url = home_url();

		return array(
			array( '/test/page', $home_url . '/test/page' ),
			array( 'no-slashes', $home_url . '/no-slashes' ),
			array( 'http://external.org/', 'http://external.org/' ),

			/*
			 * The following entry is added because of issue:
			 * https://github.com/Yoast/wordpress-seo-premium/issues/1578
			 */
			array( '/no-trailing-slash', $home_url . '/no-trailing-slash' ),
		);
	}

}
