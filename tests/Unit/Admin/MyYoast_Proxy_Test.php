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
final class MyYoast_Proxy_Test extends TestCase {

	/**
	 * Tests determine the proxy options for the research webworker file.
	 *
	 * @covers ::determine_proxy_options
	 *
	 * @return void
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
			->willReturn( 'research-webworker' );

		$instance->expects( $this->once() )
				->method( 'get_plugin_version' )
				->willReturn( '1.0' );

		$expected = [
			'content_type' => 'text/javascript; charset=UTF-8',
			'url'          => 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=1.0',
		];

		$this->assertEquals( $expected, $instance->determine_proxy_options() );
	}

	/**
	 * Test get_plugin_version.
	 *
	 * @covers ::get_plugin_version
	 *
	 * @return void
	 */
	public function test_get_plugin_version() {
		$instance               = new MyYoast_Proxy_Double();
		$_GET['plugin_version'] = '19.11';
		$this->assertEquals( '19.11', $instance->get_plugin_version() );
	}

	/**
	 * Test get_plugin_version when plugin_version is not set.
	 *
	 * @covers ::get_plugin_version
	 *
	 * @return void
	 */
	public function test_get_plugin_version_not_set() {
		$instance               = new MyYoast_Proxy_Double();
		$_GET['plugin_version'] = null;
		$this->assertEquals( '', $instance->get_plugin_version() );
	}

	/**
	 * Test get_plugin_version when plugin_version includes slashes.
	 *
	 * @covers ::get_plugin_version
	 *
	 * @return void
	 */
	public function test_get_plugin_version_with_slashes() {
		$instance               = new MyYoast_Proxy_Double();
		$_GET['plugin_version'] = '19/11';
		$this->assertEquals( '19_11', $instance->get_plugin_version() );
	}

	/**
	 * Test get_proxy_file.
	 *
	 * @covers ::get_proxy_file
	 *
	 * @return void
	 */
	public function test_get_proxy_file() {
		$instance     = new MyYoast_Proxy_Double();
		$_GET['file'] = 'this_is_a_file';
		$this->assertEquals( 'this_is_a_file', $instance->get_proxy_file() );
	}

	/**
	 * Test get_proxy_file when file is not set.
	 *
	 * @covers ::get_proxy_file
	 *
	 * @return void
	 */
	public function test_get_proxy_file_not_set() {
		$instance     = new MyYoast_Proxy_Double();
		$_GET['file'] = null;
		$this->assertEquals( '', $instance->get_proxy_file() );
	}

	/**
	 * Test is_proxy_page.
	 *
	 * @covers ::is_proxy_page
	 *
	 * @return void
	 */
	public function test_is_proxy_page() {
		$instance     = new MyYoast_Proxy_Double();
		$_GET['page'] = 'wpseo_myyoast_proxy';
		$this->assertEquals( true, $instance->is_proxy_page() );
	}

	/**
	 * Test is_proxy_page when page is not set.
	 *
	 * @covers ::is_proxy_page
	 *
	 * @return void
	 */
	public function test_is_proxy_page_not_set() {
		$instance     = new MyYoast_Proxy_Double();
		$_GET['page'] = null;
		$this->assertEquals( false, $instance->is_proxy_page() );
	}

	/**
	 * Test is_proxy_page when page is not equal to the proxy page.
	 *
	 * @covers ::is_proxy_page
	 *
	 * @return void
	 */
	public function test_is_proxy_page_wrong_page() {
		$instance     = new MyYoast_Proxy_Double();
		$_GET['page'] = 'wpseo_some_other_page';
		$this->assertEquals( false, $instance->is_proxy_page() );
	}

	/**
	 * Tests the rendering of the proxy page for an unknown file.
	 *
	 * @covers ::render_proxy_page
	 * @covers ::determine_proxy_options
	 *
	 * @return void
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
				->willReturn( 'unknown-file' );

		$instance->expects( $this->never() )
				->method( 'get_plugin_version' );

		$instance
			->expects( $this->once() )
			->method( 'set_header' )
			->with( 'HTTP/1.0 501 Requested file not implemented' );

		$instance->render_proxy_page();
	}

	/**
	 * Tests rendering of the proxy page for the research webworker file.
	 *
	 * @covers ::render_proxy_page
	 *
	 * @return void
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
			->willReturn( 'research-webworker' );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->willReturn( '1.0' );

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

		$this->expectOutputString( '' );
	}

	/**
	 * Tests rendering of the proxy page for the research webworker where the file errored.
	 *
	 * @covers ::render_proxy_page
	 *
	 * @return void
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
			->willReturn( 'research-webworker' );

		$instance
			->expects( $this->once() )
			->method( 'get_plugin_version' )
			->willReturn( '1.0' );

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

		$this->expectOutputString( '' );
	}
}
