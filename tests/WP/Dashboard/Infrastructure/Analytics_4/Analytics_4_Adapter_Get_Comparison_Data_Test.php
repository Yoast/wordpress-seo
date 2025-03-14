<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\DimensionHeader;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\MetricHeader;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\MetricValue;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\Row;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\RunReportResponse;
use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;

/**
 * Test class for the get_comparison_data() method.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_comparison_request
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::parse_comparison_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Comparison_Data_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests get_comparison_data().
	 *
	 * @dataProvider data_get_comparison_data
	 *
	 * @param array<string,array<string>> $request_parameters      The request parameters.
	 * @param array<string,array<string>> $expected_api_parameters The expected API parameters.
	 * @param array<int,array<string>>    $request_results         The results.
	 * @param array<int,string>           $expected_results        The expected results.
	 *
	 * @return void
	 */
	public function test_get_comparison_data(
		$request_parameters,
		$expected_api_parameters,
		$request_results,
		$expected_results
	) {
		self::$analytics_4_module = Mockery::mock( Analytics_4_Module_Mock::class );
		$this->instance->set_analytics_4_module( self::$analytics_4_module );

		$response = new RunReportResponse();

		$metric_header = new MetricHeader();
		$metric_header->setName( $request_results['metric_header'] );
		$response->setMetricHeaders( [ $metric_header ] );

		$dimension_header = new DimensionHeader();
		$dimension_header->setName( 'dateRange' );
		$response->setDimensionHeaders( [ $dimension_header ] );

		$row_0        = new Row();
		$metric_value = new MetricValue();
		$metric_value->setValue( $request_results['metric_value_1'] );
		$row_0->setMetricValues( [ $metric_value ] );

		$row_1        = new Row();
		$metric_value = new MetricValue();
		$metric_value->setValue( $request_results['metric_value_2'] );
		$row_1->setMetricValues( [ $metric_value ] );

		$response->setRows( [ $row_0, $row_1 ] );

		$analytics_4_parameters = new Analytics_4_Parameters();

		$analytics_4_parameters->set_start_date( $request_parameters['start_date'] );
		$analytics_4_parameters->set_end_date( $request_parameters['end_date'] );

		if ( isset( $request_parameters['dimensionFilters'] ) ) {
			$analytics_4_parameters->set_dimension_filters( $request_parameters['dimensionFilters'] );
		}

		if ( isset( $request_parameters['metrics'] ) ) {
			$analytics_4_parameters->set_metrics( $request_parameters['metrics'] );
		}

		if ( isset( $request_parameters['compare_start_date'] ) && isset( $request_parameters['compare_end_date'] ) ) {
			$analytics_4_parameters->set_compare_start_date( $request_parameters['compare_start_date'] );
			$analytics_4_parameters->set_compare_end_date( $request_parameters['compare_end_date'] );
		}

		self::$analytics_4_module->expects( 'get_data' )
			->with( 'report', $expected_api_parameters )
			->once()
			->andReturn( $response );

		$result = $this->instance->get_comparison_data( $analytics_4_parameters );

		$this->assertInstanceOf( Data_Container::class, $result );
		$this->assertSame( $expected_results, $result->to_array() );
	}

	/**
	 * Data provider for test_get_comparison_data.
	 *
	 * @return array<string, array<string, array<string, array<string, int>>>>
	 */
	public static function data_get_comparison_data() {
		return [
			'Compare organic sessions' => [
				'request_parameters'      => [
					'start_date'         => '2025-02-14',
					'end_date'           => '2025-03-13',
					'compare_start_date' => '2025-01-17',
					'compare_end_date'   => '2025-02-13',
					'metrics'            => [ 'sessions' ],
					'dimensionFilters'   => [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ],
				],
				'expected_api_parameters' => [
					'slug'             => 'analytics-4',
					'datapoint'        => 'report',
					'startDate'        => '2025-02-14',
					'endDate'          => '2025-03-13',
					'dimensionFilters' => [
						'sessionDefaultChannelGrouping' => [ 'Organic Search' ],
					],
					'metrics'          => [
						[
							'name' => 'sessions',
						],
					],
					'compareStartDate' => '2025-01-17',
					'compareEndDate'   => '2025-02-13',
				],
				'request_results'         => [
					'metric_header'  => 'sessions',
					'metric_value_1' => 2,
					'metric_value_2' => 4,
				],
				'expected_results'        => [
					[
						'current' => [
							'sessions'  => 2,
						],
						'previous' => [
							'sessions'  => 4,
						],
					],
				],
			],
			'Compare total users' => [
				'request_parameters'      => [
					'start_date'         => '2025-02-14',
					'end_date'           => '2025-03-13',
					'compare_start_date' => '2025-01-17',
					'compare_end_date'   => '2025-02-13',
					'metrics'            => [ 'totalUsers' ],
				],
				'expected_api_parameters' => [
					'slug'             => 'analytics-4',
					'datapoint'        => 'report',
					'startDate'        => '2025-02-14',
					'endDate'          => '2025-03-13',
					'metrics'          => [
						[
							'name' => 'totalUsers',
						],
					],
					'compareStartDate' => '2025-01-17',
					'compareEndDate'   => '2025-02-13',
				],
				'request_results'         => [
					'metric_header'  => 'totalUsers',
					'metric_value_1' => 2,
					'metric_value_2' => 4,
				],
				'expected_results'        => [
					[
						'current' => [
							'total_users'  => 2,
						],
						'previous' => [
							'total_users'  => 4,
						],
					],
				],
			],
		];
	}
}
