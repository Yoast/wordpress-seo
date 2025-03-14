<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the get_comparison_data() method.
 *
 * @group search_console_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::parse_comparison_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Comparison_Data_Test extends Abstract_Search_Console_Adapter_Test {

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
		self::$search_console_module = Mockery::mock( Search_Console_Module_Mock::class );

		$this->instance->set_search_console_module( self::$search_console_module );

		$response = [];
		foreach ( $request_results as $request_result ) {
			$response_row = new ApiDataRow();
			$response_row->setClicks( $request_result['clicks'] );
			$response_row->setCtr( $request_result['ctr'] );
			$response_row->setImpressions( $request_result['impressions'] );
			$response_row->setKeys( $request_result['keys'] );
			$response_row->setPosition( $request_result['position'] );

			$response[] = $response_row;
		}

		$search_console_parameters = new Search_Console_Parameters();

		$search_console_parameters->set_start_date( $request_parameters['start_date'] );
		$search_console_parameters->set_end_date( $request_parameters['end_date'] );
		$search_console_parameters->set_dimensions( $request_parameters['dimensions'] );
		$search_console_parameters->set_compare_start_date( $request_parameters['compare_start_date'] );
		$search_console_parameters->set_compare_end_date( $request_parameters['compare_end_date'] );

		if ( isset( $request_parameters['limit'] ) ) {
			$search_console_parameters->set_limit( $request_parameters['limit'] );
		}

		self::$search_console_module->expects( 'get_data' )
			->with( 'searchanalytics', $expected_api_parameters )
			->once()
			->andReturn( $response );

		$result = $this->instance->get_comparison_data( $search_console_parameters );

		$this->assertInstanceOf( Data_Container::class, $result );
		$this->assertSame( $expected_results, $result->to_array() );
	}

	/**
	 * Data provider for test_get_comparison_data.
	 *
	 * @return array<array<bool,array<string>>>
	 */
	public static function data_get_comparison_data() {
		return [
			'Compare results between the previous day and the day before' => [
				'request_parameters'      => [
					'start_date'         => '02-03-2025',
					'end_date'           => '02-03-2025',
					'compare_start_date' => '01-03-2025',
					'compare_end_date'   => '01-03-2025',
					'dimensions'         => [ 'date' ],
				],
				'expected_api_parameters' => [
					'slug'       => 'search-console',
					'datapoint'  => 'searchanalytics',
					'startDate'  => '01-03-2025',
					'endDate'    => '02-03-2025',
					'dimensions' => [ 'date' ],
				],
				'request_results'         => [
					[
						'clicks'      => 1,
						'ctr'         => 2,
						'impressions' => 4,
						'keys'        => [ '01-03-2025' ],
						'position'    => 4,
					],
					[
						'clicks'      => 2,
						'ctr'         => 2,
						'impressions' => 4,
						'keys'        => [ '02-03-2025' ],
						'position'    => 8,
					],
				],
				'expected_results'        => [
					[
						'current' => [
							'total_clicks'      => 2,
							'total_impressions' => 4,
							'average_ctr'       => 0.5,
							'average_position'  => 8,
						],
						'previous' => [
							'total_clicks'      => 1,
							'total_impressions' => 4,
							'average_ctr'       => 0.25,
							'average_position'  => 4,
						],
					],
				],
			],
		];
	}
}
