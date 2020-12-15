<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use WPSEO_MyYoast_Proxy;
use Yoast\WP\SEO\Tests\Unit\Doubles\Admin\MyYoast_Proxy_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class.
 *
 * @group MyYoast
 *
 * @coversDefaultClass WPSEO_MyYoast_Proxy
 */
class MyYoast_Proxy_Test extends TestCase {

	/**
	 * Tests determine the proxy options for the research webworker file.
	 *
	 * @covers ::determine_proxy_options
	 */
	public function test_determine_proxy_options_for_the_research_webworker_file() {
		/**
		 * Holds the instance of the class being tested.
		 *
		 * @var MyYoast_Proxy_Double $instance
		 */
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
	 * Tests the rendering of the proxy page for an unknown file.
	 *
	 * @covers ::render_proxy_page
	 * @covers ::determine_proxy_options
	 */
	public function test_render_proxy_page_for_an_unknown_file() {
		/**
		 * Holds the instance of the class being tested.
		 *
		 * @var WPSEO_MyYoast_Proxy $instance
		 */
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
	 * Tests rendering of the proxy page for the research webworker file.
	 *
	 * @covers ::render_proxy_page
	 */
	public function test_render_proxy_page_for_the_research_webworker_file() {
		/**
		 * Holds the instance of the class being tested.
		 *
		 * @var WPSEO_MyYoast_Proxy $instance
		 */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'set_header', 'get_remote_url_body' ] )
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
			->expects( $this->exactly( 2 ) )
			->method( 'set_header' )
			->withConsecutive(
				[ 'Content-Type: text/javascript; charset=UTF-8' ],
				[ 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy::CACHE_CONTROL_MAX_AGE ]
			);

		$instance
			->expects( $this->once() )
			->method( 'get_remote_url_body' )
			->with( 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0' );

		$instance->render_proxy_page();

		$this->expectOutput( '', 'Load URL succeeded, no output expected' );
	}

	/**
	 * Tests rendering of the proxy page for the research webworker where the file errored.
	 *
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

		/**
		 * Holds the instance of the class being tested.
		 *
		 * @var WPSEO_MyYoast_Proxy $instance
		 */
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Proxy::class )
			->setMethods( [ 'get_proxy_file', 'get_plugin_version', 'set_header' ] )
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
			->expects( $this->exactly( 5 ) )
			->method( 'set_header' )
			->withConsecutive(
				[ 'Content-Type: text/javascript; charset=UTF-8' ],
				[ 'Cache-Control: max-age=' . WPSEO_MyYoast_Proxy::CACHE_CONTROL_MAX_AGE ],
				[ 'Content-Type: text/plain' ],
				[ 'Cache-Control: max-age=0' ],
				[ 'HTTP/1.0 500 Received unexpected response from MyYoast' ]
			);

		$instance->render_proxy_page();

		$this->expectOutput( '', 'wp_remote_get failed, no output expected' );
	}
}
