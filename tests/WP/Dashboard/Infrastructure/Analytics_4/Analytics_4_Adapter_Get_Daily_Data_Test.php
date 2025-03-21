<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\DimensionHeader;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\DimensionValue;
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
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_daily_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_daily_request
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::parse_daily_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Daily_Data_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests test_get_daily_data().
	 *
	 * @dataProvider data_get_daily_data
	 *
	 * @param array<string,array<string>> $request_parameters      The request parameters.
	 * @param array<string,array<string>> $expected_api_parameters The expected API parameters.
	 * @param array<int,array<string>>    $request_results         The results.
	 * @param array<int,string>           $expected_results        The expected results.
	 *
	 * @return void
	 */
	public function test_get_daily_data(
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
		$dimension_header->setName( 'date' );
		$response->setDimensionHeaders( [ $dimension_header ] );

		$rows = [];
		foreach ( $request_results['days'] as $day ) {
			$row          = new Row();
			$metric_value = new MetricValue();
			$metric_value->setValue( $day['metric_value'] );
			$row->setMetricValues( [ $metric_value ] );

			$dimension_value = new DimensionValue();
			$dimension_value->setValue( $day['dimension_value'] );
			$row->setDimensionValues( [ $dimension_value ] );

			$rows[] = $row;
		}
		$response->setRows( $rows );

		$analytics_4_parameters = new Analytics_4_Parameters();

		$analytics_4_parameters->set_start_date( $request_parameters['start_date'] );
		$analytics_4_parameters->set_end_date( $request_parameters['end_date'] );

		if ( isset( $request_parameters['dimensionFilters'] ) ) {
			$analytics_4_parameters->set_dimension_filters( $request_parameters['dimensionFilters'] );
		}

		if ( isset( $request_parameters['metrics'] ) ) {
			$analytics_4_parameters->set_metrics( $request_parameters['metrics'] );
		}

		if ( isset( $request_parameters['dimensions'] ) ) {
			$analytics_4_parameters->set_dimensions( $request_parameters['dimensions'] );
		}

		if ( isset( $request_parameters['orderby'] ) ) {
			$analytics_4_parameters->set_order_by( 'dimension', $request_parameters['orderby'] );
		}

		self::$analytics_4_module->expects( 'get_data' )
			->with( 'report', $expected_api_parameters )
			->once()
			->andReturn( $response );

		$result = $this->instance->get_daily_data( $analytics_4_parameters );

		$this->assertInstanceOf( Data_Container::class, $result );
		$this->assertSame( $expected_results, $result->to_array() );
	}

	/**
	 * Data provider for test_get_daily_data.
	 *
	 * @return array<string, array<string, array<string, array<string, int>>>>
	 */
	public static function data_get_daily_data() {
		return [
			'Organic sessions for two days' => [
				'request_parameters'      => [
					'start_date'         => '2025-02-01',
					'end_date'           => '2025-02-02',
					'metrics'            => [ 'sessions' ],
					'dimensions'         => [ 'date' ],
					'dimensionFilters'   => [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ],
					'orderby'            => 'date',
				],
				'expected_api_parameters' => [
					'slug'             => 'analytics-4',
					'datapoint'        => 'report',
					'startDate'        => '2025-02-01',
					'endDate'          => '2025-02-02',
					'dimensionFilters' => [
						'sessionDefaultChannelGrouping' => [ 'Organic Search' ],
					],
					'dimensions'       => [
						[
							'name' => 'date',
						],
					],
					'metrics'          => [
						[
							'name' => 'sessions',
						],
					],
					'orderby'          => [
						[
							'dimension' => [
								'dimensionName' => 'date',
							],
						],
					],
				],
				'request_results'         => [
					'metric_header' => 'sessions',
					'days'          => [
						[
							'metric_value'    => 2,
							'dimension_value' => '2025-02-01',
						],
						[
							'metric_value'    => 4,
							'dimension_value' => '2025-02-02',
						],
					],
				],
				'expected_results'        => [
					[
						'date'     => '2025-02-01',
						'sessions' => 2,
					],
					[
						'date'     => '2025-02-02',
						'sessions' => 4,
					],
				],
			],
			'Total users for three days' => [
				'request_parameters'      => [
					'start_date'         => '2025-02-01',
					'end_date'           => '2025-02-03',
					'metrics'            => [ 'totalUsers' ],
					'dimensions'         => [ 'date' ],
					'orderby'            => 'date',
				],
				'expected_api_parameters' => [
					'slug'             => 'analytics-4',
					'datapoint'        => 'report',
					'startDate'        => '2025-02-01',
					'endDate'          => '2025-02-03',
					'dimensions'       => [
						[
							'name' => 'date',
						],
					],
					'metrics'          => [
						[
							'name' => 'totalUsers',
						],
					],
					'orderby'          => [
						[
							'dimension' => [
								'dimensionName' => 'date',
							],
						],
					],
				],
				'request_results'         => [
					'metric_header' => 'totalUsers',
					'days'          => [
						[
							'metric_value'    => 2,
							'dimension_value' => '2025-02-01',
						],
						[
							'metric_value'    => 4,
							'dimension_value' => '2025-02-02',
						],
						[
							'metric_value'    => 3,
							'dimension_value' => '2025-02-03',
						],
					],
				],
				'expected_results'        => [
					[
						'date'        => '2025-02-01',
						'total_users' => 2,
					],
					[
						'date'        => '2025-02-02',
						'total_users' => 4,
					],
					[
						'date'        => '2025-02-03',
						'total_users' => 3,
					],
				],
			],
		];
	}
}
