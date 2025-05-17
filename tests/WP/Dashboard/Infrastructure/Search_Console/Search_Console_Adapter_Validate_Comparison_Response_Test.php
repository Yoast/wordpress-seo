<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Mockery;
use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Unexpected_Response_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for failing the validate_response() method.
 *
 * @group search_console_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::validate_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Validate_Comparison_Response_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests validate_response() for unexpected response for not being an array.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_array() {

		$request_parameters = $this->create_search_console_parameters();

		$expected_message = 'The response from Google Site Kit did not have an expected format.';

		$api_response_mock = Mockery::mock( WP_REST_Response::class );
		$api_response_mock->expects( 'get_data' )->once()->andReturn( 'not an array' );
		$api_response_mock->expects( 'is_error' )->once()->andReturnFalse();

		$this->search_console_api_call_mock->expects( 'do_request' )
			->andReturn( $api_response_mock );

		$this->expectException( Unexpected_Response_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_comparison_data( $request_parameters );
	}

	/**
	 * Tests validate_response() for failed requests.
	 *
	 * @return void
	 */
	public function test_validate_response_failed_request() {
		$request_parameters = $this->create_search_console_parameters();

		$error_response    = new WP_Error(
			'test_error',
			'this is an error',
			[
				'status' => 400,
			]
		);
		$api_response_mock = Mockery::mock( WP_REST_Response::class );
		$api_response_mock->expects( 'get_data' )->once()->andReturn( 'not an array' );
		$api_response_mock->expects( 'is_error' )->once()->andReturnTrue();
		$api_response_mock->expects( 'as_error' )->once()->andReturn( $error_response );

		$this->search_console_api_call_mock->expects( 'do_request' )
			->andReturn( $api_response_mock );

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( 'this is an error' );
		$this->expectExceptionCode( 400 );

		$this->instance->get_comparison_data( $request_parameters );
	}

	/**
	 * Creates and returns Search Console parameters.
	 *
	 * @return Search_Console_Parameters
	 */
	protected function create_search_console_parameters() {
		$request_parameters = new Search_Console_Parameters();
		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_dimensions( [ 'date' ] );

		return $request_parameters;
	}
}
