<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Mockery;
use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Unexpected_Response_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;

/**
 * Test class for failing the validate_response() method.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::validate_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Validate_Comparison_Response_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests validate_response() for unexpected response for not being a RunReportResponse object.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_array() {

		$request_parameters = $this->create_analytics_4_parameters();

		$expected_message = 'The response from Google Site Kit did not have an expected format.';

		$api_response_mock = Mockery::mock( WP_REST_Response::class );
		$api_response_mock->expects( 'get_data' )->once()->andReturn( 'not a RunReportResponse object' );
		$api_response_mock->expects( 'is_error' )->once()->andReturnFalse();

		$this->analytics_4_api_call_mock->expects( 'do_request' )
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

		$request_parameters = $this->create_analytics_4_parameters();

		$error_response = new WP_Error(
			'test_error',
			'this is an error',
			[
				'status' => 400,
			]
		);

		$api_response_mock = Mockery::mock( WP_REST_Response::class );
		$api_response_mock->expects( 'get_data' )->once()->andReturn( 'not a RunReportResponse object' );
		$api_response_mock->expects( 'is_error' )->once()->andReturnTrue();
		$api_response_mock->expects( 'as_error' )->once()->andReturn( $error_response );

		$this->analytics_4_api_call_mock->expects( 'do_request' )
			->andReturn( $api_response_mock );

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( 'this is an error' );
		$this->expectExceptionCode( 400 );

		$this->instance->get_comparison_data( $request_parameters );
	}

	/**
	 * Creates and returns Analytics 4 parameters.
	 *
	 * @return Search_Console_Parameters
	 */
	protected function create_analytics_4_parameters() {
		$request_parameters = new Analytics_4_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_compare_end_date( '28-02-2025' );
		$request_parameters->set_metrics( [ 'sessions' ] );
		$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );

		return $request_parameters;
	}
}
