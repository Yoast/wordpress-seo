<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\RunReportResponse;
use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Invalid_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;

/**
 * Test class for the get_daily_data method when response is a RunReportResponse object with not the right dimensions.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_daily_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::parse_daily_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_daily_request
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Daily_Data_Invalid_Request_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests get_daily_data() for when response is a RunReportResponse object with not the right dimensions.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_apidatarows() {
		self::$analytics_4_module = Mockery::mock( Analytics_4_Module_Mock::class );
		$this->instance->set_analytics_4_module( self::$analytics_4_module );

		$request_parameters = new Analytics_4_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_metrics( [ 'sessions' ] );
		$request_parameters->set_dimensions( [ 'date' ] );
		$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );
		$request_parameters->set_order_by( 'dimension', 'date' );

		$expected_message = 'The Analytics 4 request is invalid: Unexpected parameters for the request';

		$result = new RunReportResponse();

		self::$analytics_4_module->expects( 'get_data' )
			->once()
			->andReturn( $result );

		$this->expectException( Invalid_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_daily_data( $request_parameters );
	}
}
