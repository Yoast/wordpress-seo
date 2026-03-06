<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;

use Generator;
use Mockery;
use stdClass;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Test class for the serve_custom_response method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration::serve_custom_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Response_Header_Integration_Serve_Custom_Response_Test extends Abstract_Site_Schema_Response_Header_Integration_Test {

	/**
	 * Tests that a non-matching route returns (bool) $served.
	 *
	 * @dataProvider serve_custom_response_non_matching_route_data
	 *
	 * @param mixed  $served   The served value passed to the filter.
	 * @param string $route    The request route.
	 * @param bool   $expected The expected return value.
	 *
	 * @return void
	 */
	public function test_returns_cast_served_for_non_matching_route( $served, $route, $expected ) {
		$request  = Mockery::mock( WP_REST_Request::class );
		$response = Mockery::mock( WP_REST_Response::class );

		$request->expects( 'get_route' )->andReturn( $route );

		$this->assertSame( $expected, $this->instance->serve_custom_response( $served, $response, $request ) );
	}

	/**
	 * Tests that a non-WP_REST_Request returns (bool) $served.
	 *
	 * @dataProvider serve_custom_response_non_rest_request_data
	 *
	 * @param mixed $served   The served value passed to the filter.
	 * @param bool  $expected The expected return value.
	 *
	 * @return void
	 */
	public function test_returns_cast_served_for_non_rest_request( $served, $expected ) {
		$request = new stdClass();
		$result  = Mockery::mock( WP_REST_Response::class );

		$this->assertSame( $expected, $this->instance->serve_custom_response( $served, $result, $request ) );
	}

	/**
	 * Tests that a matching route with an error response returns (bool) $served.
	 *
	 * @dataProvider serve_custom_response_error_response_data
	 *
	 * @param mixed $served   The served value passed to the filter.
	 * @param bool  $expected The expected return value.
	 *
	 * @return void
	 */
	public function test_returns_cast_served_for_error_response( $served, $expected ) {
		$request  = Mockery::mock( WP_REST_Request::class );
		$response = Mockery::mock( WP_REST_Response::class );

		$request->expects( 'get_route' )->andReturn( '/yoast/v1/schema-aggregator/schema' );
		$response->expects( 'is_error' )->andReturn( true );

		$this->assertSame( $expected, $this->instance->serve_custom_response( $served, $response, $request ) );
	}

	/**
	 * Tests that a matching route with a non-WP_REST_Response result returns (bool) $served.
	 *
	 * @dataProvider serve_custom_response_non_rest_response_data
	 *
	 * @param mixed $served   The served value passed to the filter.
	 * @param bool  $expected The expected return value.
	 *
	 * @return void
	 */
	public function test_returns_cast_served_for_non_rest_response( $served, $expected ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$result  = new stdClass();

		$request->expects( 'get_route' )->andReturn( '/yoast/v1/schema-aggregator/schema' );

		$this->assertSame( $expected, $this->instance->serve_custom_response( $served, $result, $request ) );
	}

	/**
	 * Tests that a matching route with a valid response returns true.
	 *
	 * @dataProvider serve_custom_response_valid_request_data
	 *
	 * @param mixed $served The served value passed to the filter.
	 *
	 * @return void
	 */
	public function test_returns_true_for_valid_matching_request( $served ) {
		$request  = Mockery::mock( WP_REST_Request::class );
		$response = Mockery::mock( WP_REST_Response::class );

		$request->expects( 'get_route' )->andReturn( '/yoast/v1/schema-aggregator/schema' );
		$response->expects( 'is_error' )->andReturn( false );

		$this->schema_map_header_adapter
			->expects( 'set_header_for_request' )
			->once()
			->with( $response );

		$this->assertTrue( $this->instance->serve_custom_response( $served, $response, $request ) );
	}

	/**
	 * Data provider for the non-matching route test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function serve_custom_response_non_matching_route_data() {
		yield 'null served, unrelated route' => [
			'served'   => null,
			'route'    => '/wp/v2/posts',
			'expected' => false,
		];
		yield 'false served, unrelated route' => [
			'served'   => false,
			'route'    => '/wp/v2/posts',
			'expected' => false,
		];
		yield 'true served, unrelated route' => [
			'served'   => true,
			'route'    => '/wp/v2/posts',
			'expected' => true,
		];
		yield 'null served, partial match not at start' => [
			'served'   => null,
			'route'    => '/other/yoast/v1/schema-aggregator',
			'expected' => false,
		];
	}

	/**
	 * Data provider for the non-WP_REST_Request test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function serve_custom_response_non_rest_request_data() {
		yield 'null served' => [
			'served'   => null,
			'expected' => false,
		];
		yield 'false served' => [
			'served'   => false,
			'expected' => false,
		];
		yield 'true served' => [
			'served'   => true,
			'expected' => true,
		];
	}

	/**
	 * Data provider for the error response test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function serve_custom_response_error_response_data() {
		yield 'null served' => [
			'served'   => null,
			'expected' => false,
		];
		yield 'false served' => [
			'served'   => false,
			'expected' => false,
		];
		yield 'true served' => [
			'served'   => true,
			'expected' => true,
		];
	}

	/**
	 * Data provider for the non-WP_REST_Response test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function serve_custom_response_non_rest_response_data() {
		yield 'null served' => [
			'served'   => null,
			'expected' => false,
		];
		yield 'false served' => [
			'served'   => false,
			'expected' => false,
		];
		yield 'true served' => [
			'served'   => true,
			'expected' => true,
		];
	}

	/**
	 * Data provider for the valid matching request test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function serve_custom_response_valid_request_data() {
		yield 'null served' => [
			'served' => null,
		];
		yield 'false served' => [
			'served' => false,
		];
		yield 'true served' => [
			'served' => true,
		];
	}
}
