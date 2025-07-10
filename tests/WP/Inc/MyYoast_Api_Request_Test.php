<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use Generator;
use WP_Error;
use WPSEO_MyYoast_Api_Request;
use WPSEO_MyYoast_Bad_Request_Exception;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\MyYoast_Api_Request_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 *
 * @group MyYoast
 */
final class MyYoast_Api_Request_Test extends TestCase {

	private const VALID_RESPONSE = '{"url":"basic.wordpress.test\/","subscriptions":[{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z","product":{"version":"15.5","name":"Yoast Local SEO","slug":"yoast-seo-local","last_updated":"2025-04-03T06:25:21.439Z","store_url":"https:\/\/yoast.com\/shop","download":"https:\/\/yoast.com\/app\/uploads\/2024\/11\/wordpress-seo-local-15.5.zip","changelog":"<p>Hey!<\/p><p>The changelog for this plugin can be found <a href=\'https:\/\/yoa.st\/4x0\' target=\'_blank\'>here<\/a>. Check it out to find all the bugs we fixed and the features we added!<\/p>"}},{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z","product":{"version":"15.0","name":"Yoast Video SEO","slug":"yoast-seo-video","last_updated":"2025-04-03T06:25:23.244Z","store_url":"https:\/\/yoast.com\/shop","download":"https:\/\/yoast.com\/app\/uploads\/2024\/12\/wpseo-video-15.0.zip","changelog":"<p>Hey!<\/p><p>The changelog for this plugin can be found <a href=\'https:\/\/yoa.st\/4wz\' target=\'_blank\'>here<\/a>. Check it out to find all the bugs we fixed and the features we added!<\/p>"}},{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z","product":{"version":"16.5","name":"Yoast WooCommerce SEO","slug":"yoast-seo-woocommerce","last_updated":"2025-04-03T06:25:23.136Z","store_url":"https:\/\/yoast.com\/shop","download":"https:\/\/yoast.com\/app\/uploads\/2024\/12\/wpseo-woocommerce-16.5.zip","changelog":"<p>Hey!<\/p><p>The changelog for this plugin can be found <a href=\'https:\/\/yoa.st\/4x2\' target=\'_blank\'>here<\/a>. Check it out to find all the bugs we fixed and the features we added!<\/p>"}},{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z","product":{"version":"13.3","name":"Yoast News SEO","slug":"yoast-seo-news","last_updated":"2025-04-03T06:25:21.633Z","store_url":"https:\/\/yoast.com\/shop","download":"https:\/\/yoast.com\/app\/uploads\/2025\/02\/wpseo-news-13.3.zip","changelog":"<p>Hey!<\/p><p>The changelog for this plugin can be found <a href=\'https:\/\/yoa.st\/4x1\' target=\'_blank\'>here<\/a>. Check it out to find all the bugs we fixed and the features we added!<\/p>"}},{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z","product":{"version":"25.3.1","name":"Yoast SEO Premium","slug":"yoast-seo-wordpress-premium","last_updated":"2025-06-18T18:28:06.333Z","store_url":"https:\/\/yoast.com\/shop","download":"https:\/\/yoast.com\/app\/uploads\/2025\/06\/wordpress-seo-premium-25.3.1.zip","changelog":"<p>Hey!<\/p><p>The changelog for this plugin can be found <a href=\'https:\/\/yoa.st\/4wy\' target=\'_blank\'>here<\/a>. Check it out to find all the bugs we fixed and the features we added!<\/p>"}}]}';

	/**
	 * Tests firing the request (happy path).
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::get_response
	 *
	 * @return void
	 */
	public function test_fire() {
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Api_Request::class )
			->setMethods( [ 'do_request', 'decode_response' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->willReturn( self::VALID_RESPONSE );

		$instance
			->expects( $this->once() )
			->method( 'decode_response' )
			->willReturn( \json_decode( self::VALID_RESPONSE ) );

		$this->assertTrue( $instance->fire() );
		$this->assertEquals( \json_decode( self::VALID_RESPONSE ), $instance->get_response() );
	}

	/**
	 * Tests firing the request with an exception being thrown.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::get_error_message
	 *
	 * @return void
	 */
	public function test_fire_with_bad_request_exception_being_thrown() {
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Api_Request::class )
			->setMethods( [ 'do_request', 'decode_response' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->willThrowException( new WPSEO_MyYoast_Bad_Request_Exception( 'Request went wrong' ) );

		$instance
			->expects( $this->never() )
			->method( 'decode_response' );

		$this->assertFalse( $instance->fire() );
		$this->assertEquals( 'Request went wrong', $this->getPropertyValue( $instance, 'error_message' ) );
		$this->assertEquals( 'Request went wrong', $instance->get_error_message() );
	}

	/**
	 * Tests the decoding of the response with valid input.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::decode_response
	 *
	 * @return void
	 */
	public function test_decode_response() {
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Api_Request::class )
			->setMethods( [ 'do_request' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$response = [
			'url'           => 'basic.wordpress.test/',
			'subscriptions' => [
				(object) [
					'renewal_url' => '',
					'expiry_date' => '2037-02-01T00:00:00.000Z',
				],
				(object) [
					'renewal_url' => '',
					'expiry_date' => '2033-02-01T00:00:00.000Z',
				],
			],
		];

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->willReturn( WPSEO_Utils::format_json_encode( $response ) );

		$this->assertTrue( $instance->fire() );
		$this->assertEquals( (object) $response, $this->getPropertyValue( $instance, 'response' ) );
		$this->assertEquals( (object) $response, $instance->get_response() );
	}

	/**
	 * Tests the decoding of the response with invalid input.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::decode_response
	 *
	 * @return void
	 */
	public function test_decode_response_wrong_output() {
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Api_Request::class )
			->setMethods( [ 'do_request' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->willReturn( 'raw_response' );

		$this->assertFalse( $instance->fire() );
		$this->assertEquals( 'No JSON object was returned.', $this->getPropertyValue( $instance, 'error_message' ) );
	}

	/**
	 * Tests the validating of the response with invalid input.
	 *
	 * @covers       WPSEO_MyYoast_Api_Request::fire
	 * @covers       WPSEO_MyYoast_Api_Request::decode_response
	 * @covers       WPSEO_MyYoast_Api_Request::validate_response
	 *
	 * @dataProvider data_provider_test_validate_response_wrong_output
	 *
	 * @param string $response The response to test.
	 *
	 * @return void
	 */
	public function test_validate_response_wrong_output( string $response ) {
		$instance = $this
			->getMockBuilder( WPSEO_MyYoast_Api_Request::class )
			->setMethods( [ 'do_request', 'decode_response' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->willReturn( $response );

		$instance
			->expects( $this->once() )
			->method( 'decode_response' )
			->willReturn( \json_decode( $response ) );

		$this->assertFalse( $instance->fire() );
		$this->assertEquals( 'Not all needed fields are present.', $this->getPropertyValue( $instance, 'error_message' ) );
	}

	/**
	 * Data provider for test_validate_response_wrong_output().
	 *
	 * @return Generator
	 */
	public function data_provider_test_validate_response_wrong_output() {
		yield 'Nonsense JSON object' => [ 'response' => '{"invalid":"something" }' ];
		yield 'No subscriptions JSON object' => [ 'response' => '{"url":"valid" }' ];
		yield 'Subscriptions JSON object without array' => [ 'response' => '{"url":"valid", "subscriptions":"something" }' ];
		yield 'Subscriptions but no url' => [ 'response' => '{"subscriptions":[{"renewal_url":"","expiry_date":"2037-02-01T00:00:00.000Z"}] }' ];
	}

	/**
	 * Tests the enriching of the request headers.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::enrich_request_arguments
	 *
	 * @return void
	 */
	public function test_enrich_request_arguments() {
		$instance = $this
			->getMockBuilder( MyYoast_Api_Request_Double::class )
			->setMethods( [ 'get_request_body', 'get_installed_addon_versions' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->willReturn(
				[
					'This is' => 'the request body',
				]
			);

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->willReturn(
				[
					'yoast-seo-wordpress-premium' => '10.0',
				]
			);

		$this->assertEquals(
			[
				'body'    => [
					'This is' => 'the request body',
				],
				'headers' => [
					'yoast-seo-wordpress-premium-version' => '10.0',
				],
			],
			$instance->enrich_request_arguments( [] )
		);
	}

	/**
	 * Tests the enriching of the request headers with empty request body.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::enrich_request_arguments
	 *
	 * @return void
	 */
	public function test_enrich_request_arguments_with_empty_request_body() {
		$instance = $this
			->getMockBuilder( MyYoast_Api_Request_Double::class )
			->setMethods( [ 'get_request_body', 'get_installed_addon_versions' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->willReturn( [] );

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->willReturn(
				[
					'yoast-seo-wordpress-premium' => '10.0',
				]
			);

		$this->assertEquals(
			[
				'headers' => [
					'yoast-seo-wordpress-premium-version' => '10.0',
				],
			],
			$instance->enrich_request_arguments( [] )
		);
	}

	/**
	 * Test Exception is being called correctly.
	 *
	 * Unit test to make sure this is fixed: https://github.com/Yoast/wordpress-seo/issues/12560
	 *
	 * @covers WPSEO_MyYoast_Api_Request::do_request
	 *
	 * @return void
	 */
	public function test_exception_arguments() {
		$this->expectException( WPSEO_MyYoast_Bad_Request_Exception::class );
		$this->expectExceptionMessage( 'Error' );

		\add_filter( 'pre_http_request', [ $this, 'return_error_object' ] );

		$instance = new MyYoast_Api_Request_Double( 'some_url', [] );
		$instance->do_request( 'some_url', [] );

		\remove_filter( 'pre_http_request', [ $this, 'return_error_object' ] );
	}

	/**
	 * Helper function for the `test_exception_arguments` test
	 *
	 * @return WP_Error
	 */
	public function return_error_object() {
		return new WP_Error( 'error-code', 'Error' );
	}
}
