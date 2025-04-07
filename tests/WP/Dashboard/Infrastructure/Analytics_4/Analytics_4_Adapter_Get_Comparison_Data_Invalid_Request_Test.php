<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\RunReportResponse;
use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Invalid_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;

/**
 * Test class for the get_comparison_data method when response is a RunReportResponse object with not the right dimensions.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::parse_comparison_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_comparison_request
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Comparison_Data_Invalid_Request_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests get_comparison_data() for when response is a RunReportResponse object with not the right dimensions.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_apidatarows() {
		$api_response_mock = Mockery::mock( WP_REST_Response::class );

		$request_parameters = new Analytics_4_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_compare_end_date( '28-02-2025' );
		$request_parameters->set_metrics( [ 'sessions' ] );
		$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );

		$expected_message = 'The Analytics 4 request is invalid: Unexpected parameters for the request';

		$result = new RunReportResponse();

		$api_response_mock->expects( 'get_data' )->once()->andReturn( $result );
		$api_response_mock->expects( 'is_error' )->once()->andReturnFalse();

		$this->analytics_4_api_call_mock->expects( 'do_request' )
			->andReturn( $api_response_mock );

		$this->expectException( Invalid_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_comparison_data( $request_parameters );
	}
}
