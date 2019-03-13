<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 *
 * @group MyYoast
 */
class WPSEO_MyYoast_Proxy_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_MyYoast_Proxy::determine_proxy_options()
	 */
	public function test_determine_proxy_options_for_the_research_webworker_file() {
		/** @var WPSEO_MyYoast_Proxy_Double $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy_Double' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance->expects( $this->once() )
				->method( 'get_plugin_version' )
				->will( $this->returnValue( '1.0' ) );

		$expected = array(
			'content_type' => 'text/javascript; charset=UTF-8',
			'url'          => 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0',
		);

		$this->assertEquals( $expected, $instance->determine_proxy_options() );
	}

	/**
	 * @covers WPSEO_MyYoast_Proxy::render_proxy_page()
	 * @covers WPSEO_MyYoast_Proxy::determine_proxy_options()
	 */
	public function test_render_proxy_page_for_an_unknown_file() {
		/** @var WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version', 'set_header' ) )
			->getMock();

		$instance->expects( $this->once() )
				->method( 'get_proxy_file' )
				->will( $this->returnValue( 'unknown-file' ) );

		$instance->expects( $this->never() )
				->method( 'get_plugin_version' );

		$instance
			->expects( $this->once() )
			->method( 'set_header' )
			->with( $this->equalTo( 'HTTP/1.0 501 Requested file not implemented' ) );

		$instance->render_proxy_page();
	}

	/**
	 * @covers WPSEO_MyYoast_Proxy::render_proxy_page()
	 */
	public function test_render_proxy_page_for_the_research_webworker_file() {
		/** @var WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->will( $this->returnValue( '1.0' ) );

		$instance
			->expects( $this->at( 2 ) )
			->method( 'set_header' )
			->with( 'Content-Type: text/javascript; charset=UTF-8' );

		$instance
			->expects( $this->at( 3 ) )
			->method( 'set_header' )
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy_Double::CACHE_CONTROL_MAX_AGE );

		$instance
			->expects( $this->once() )
			->method( 'should_load_url_directly' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'load_url' )
			->will( $this->returnValue( true ) );

		$instance->render_proxy_page();

		$this->expectOutput( '', 'Load URL succeeded, no output expected' );
	}

	/**
	 * @covers WPSEO_MyYoast_Proxy::render_proxy_page()
	 *
	 * @expectedException        Exception
	 * @expectedExceptionMessage Received unexpected response from MyYoast
	 */
	public function test_render_proxy_page_for_the_research_webworker_file_errored_and_wordpress_not_found() {
		/** @var WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->will( $this->returnValue( '1.0' ) );

		$instance
			->expects( $this->at( 2 ) )
			->method( 'set_header' )
			->with( 'Content-Type: text/javascript; charset=UTF-8' );

		$instance
			->expects( $this->at( 3 ) )
			->method( 'set_header' )
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy_Double::CACHE_CONTROL_MAX_AGE );

		$instance
			->expects( $this->once() )
			->method( 'should_load_url_directly' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'load_url' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->at( 6 ) )
			->method( 'set_header' )
			->with( 'Content-Type: text/plain' );

		$instance
			->expects( $this->at( 7 ) )
			->method( 'set_header' )
			->with( 'Cache-Control: max-age=0' );

		$instance
			->expects( $this->at( 8 ) )
			->method( 'set_header' )
			->with( 'HTTP/1.0 500 Received unexpected response from MyYoast' );

		add_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__not_found' ) );
		$instance->render_proxy_page();
		remove_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__not_found' ) );

		$this->expectOutput( '', 'wp_remote_get failed, no output expected' );
	}

	/**
	 * @covers WPSEO_MyYoast_Proxy::render_proxy_page()
	 */
	public function test_render_proxy_page_via_wordpress() {
		/** @var WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->will( $this->returnValue( '1.0' ) );

		$instance
			->expects( $this->once() )
			->method( 'should_load_url_directly' )
			->will( $this->returnValue( false ) );

		add_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__success' ) );
		$instance->render_proxy_page();
		remove_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__success' ) );

		$this->expectOutput( 'success', 'Load URL succeeded, success expected' );
	}

	/**
	 * @covers WPSEO_MyYoast_Proxy::render_proxy_page()
	 *
	 * @expectedException        Exception
	 * @expectedExceptionMessage Unable to retrieve file from MyYoast
	 */
	public function test_render_proxy_page_via_wordpress_errored() {
		/** @var WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Proxy' )
			->setMethods( array( 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->will( $this->returnValue( '1.0' ) );

		$instance
			->expects( $this->at( 2 ) )
			->method( 'set_header' )
			->with( 'Content-Type: text/javascript; charset=UTF-8' );

		$instance
			->expects( $this->at( 3 ) )
			->method( 'set_header' )
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy_Double::CACHE_CONTROL_MAX_AGE );

		$instance
			->expects( $this->once() )
			->method( 'should_load_url_directly' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->at( 5 ) )
			->method( 'set_header' )
			->with( 'Content-Type: text/plain' );

		$instance
			->expects( $this->at( 6 ) )
			->method( 'set_header' )
			->with( 'Cache-Control: max-age=0' );

		$instance
			->expects( $this->at( 7 ) )
			->method( 'set_header' )
			->with( $this->equalTo( 'HTTP/1.0 500 Unable to retrieve file from MyYoast' ) );

		add_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__wp_error' ) );
		$instance->render_proxy_page();
		remove_filter( 'pre_http_request', array( $this, 'filter_wp_remote_get__wp_error' ) );

		$this->expectOutput( '', 'wp_remote_get failed, no output expected' );
	}

	/**
	 * Returns a HTTP request error.
	 *
	 * Use this in combination with WordPress's `pre_http_request` filter.
	 *
	 * @return WP_Error
	 */
	public function filter_wp_remote_get__wp_error() {
		return new WP_Error();
	}

	/**
	 * Returns a successful WP_HTTP_Request_Response as an array.
	 *
	 * Use this in combination with WordPress's `pre_http_request` filter.
	 *
	 * @return array
	 */
	public function filter_wp_remote_get__success() {
		$response              = new Requests_Response();
		$response->body        = 'success';
		$response->raw         = 'success';
		$response->status_code = 200;

		$http_response = new WP_HTTP_Requests_Response( $response, '' );
		return $http_response->to_array();
	}

	/**
	 * Returns a failed WP_HTTP_Request_Response as an array.
	 *
	 * Use this in combination with WordPress's `pre_http_request` filter.
	 *
	 * @return array
	 */
	public function filter_wp_remote_get__not_found() {
		$response              = new Requests_Response();
		$response->body        = 'not found';
		$response->raw         = 'not found';
		$response->status_code = 404;

		$http_response = new WP_HTTP_Requests_Response( $response, '' );
		return $http_response->to_array();
	}
}
