<?php

namespace Yoast\WP\Free\Tests\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_MyYoast_Proxy;
use Yoast\WP\Free\Tests\Doubles\Admin\MyYoast_Proxy_Double;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit test class.
 *
 * @group MyYoast
 *
 * @coversDefaultClass WPSEO_MyYoast_Proxy
 * @covers <!public>
 */
class MyYoast_Proxy_Test extends TestCase {

	/**
	 * @covers ::determine_proxy_options
	 */
	public function test_determine_proxy_options_for_the_research_webworker_file() {
		/** @var \Yoast\WP\Free\Tests\Doubles\Admin\MyYoast_Proxy_Double $instance */
		$instance = $this
			->getMockBuilder( MyYoast_Proxy_Double::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version' ] )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_proxy_file' )
			->will( $this->returnValue( 'research-webworker' ) );

		$instance->expects( $this->once() )
				->method( 'get_plugin_version' )
				->will( $this->returnValue( '1.0' ) );

		$expected = [
			'content_type' => 'text/javascript; charset=UTF-8',
			'url'          => 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0',
		];

		$this->assertEquals( $expected, $instance->determine_proxy_options() );
	}

	/**
	 * @covers ::render_proxy_page
	 * @covers ::determine_proxy_options
	 */
	public function test_render_proxy_page_for_an_unknown_file() {
		/** @var \WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'set_header' ] )
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
	 * @covers ::render_proxy_page
	 */
	public function test_render_proxy_page_for_the_research_webworker_file() {
		/** @var \WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ] )
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
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy::CACHE_CONTROL_MAX_AGE );

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
	 * @covers ::render_proxy_page
	 */
	public function test_render_proxy_page_for_the_research_webworker_file_errored_and_wordpress_not_found() {
		Monkey\Functions\expect( 'wp_remote_get' )
			->times( 1 )
			->with( 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0' )
			->andReturn( 'response' );

		Monkey\Functions\expect( 'wp_remote_retrieve_response_code' )
			->times( 1 )
			->with( 'response' )
			->andReturn( 404 );

		/** @var \WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ] )
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
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy::CACHE_CONTROL_MAX_AGE );

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

		$instance->render_proxy_page();

		$this->expectOutput( '', 'wp_remote_get failed, no output expected' );
	}

	/**
	 * @covers ::render_proxy_page
	 */
	public function test_render_proxy_page_via_wordpress() {
		Monkey\Functions\expect( 'wp_remote_get' )
			->times( 1 )
			->with( 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0' )
			->andReturn( 'response' );

		Monkey\Functions\expect( 'wp_remote_retrieve_response_code' )
			->times( 1 )
			->with( 'response' )
			->andReturn( 200 );

		Monkey\Functions\expect( 'wp_remote_retrieve_body' )
			->times( 1 )
			->with( 'response' )
			->andReturn( 'success' );

		/** @var \WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ] )
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

		$instance->render_proxy_page();

		$this->expectOutput( 'success', 'Load URL succeeded, success expected' );
	}

	/**
	 * @covers ::render_proxy_page
	 */
	public function test_render_proxy_page_via_wordpress_errored() {
		$wp_error_mock = Mockery::mock( '\WP_Error' );

		Monkey\Functions\expect( 'wp_remote_get' )
			->times( 1 )
			->with( 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0' )
			->andReturn( $wp_error_mock );

		/** @var \WPSEO_MyYoast_Proxy $instance */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'should_load_url_directly', 'set_header', 'load_url' ] )
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
			->with( 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy::CACHE_CONTROL_MAX_AGE );

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

		$instance->render_proxy_page();

		$this->expectOutput( '', 'wp_remote_get failed, no output expected' );
	}
}
