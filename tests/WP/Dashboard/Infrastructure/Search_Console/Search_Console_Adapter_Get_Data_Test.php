<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the get_data() method.
 *
 * @group search_console_adapter
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::validate_response
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::parse_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Data_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests get_data().
	 *
	 * @dataProvider data_get_data
	 *
	 * @param array<string,array<string>> $request_parameters      The request parameters.
	 * @param array<string,array<string>> $expected_api_parameters The expected API parameters.
	 * @param array<int,array<string>>    $request_results         The results.
	 * @param array<int,string>           $expected_results        The expected results.
	 *
	 * @return void
	 */
	public function test_get_data(
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

		if ( isset( $request_parameters['limit'] ) ) {
			$search_console_parameters->set_limit( $request_parameters['limit'] );
		}

		self::$search_console_module->expects( 'get_data' )
			->with( 'searchanalytics', $expected_api_parameters )
			->once()
			->andReturn( $response );

		$result = $this->instance->get_data( $search_console_parameters );

		$this->assertInstanceOf( Data_Container::class, $result );
		$this->assertSame( $expected_results, $result->to_array() );
	}

	/**
	 * Data provider for test_get_data.
	 *
	 * @return array<array<bool,array<string>>>
	 */
	public static function data_get_data() {
		return [
			'Top pages with two results' => [
				'request_parameters'      => [
					'start_date' => '31-05-1988',
					'end_date'   => '06-03-2025',
					'dimensions' => [ 'page' ],
				],
				'expected_api_parameters' => [
					'slug'       => 'search-console',
					'datapoint'  => 'searchanalytics',
					'startDate'  => '31-05-1988',
					'endDate'    => '06-03-2025',
					'dimensions' => [ 'page' ],
				],
				'request_results'         => [
					[
						'clicks'      => 1,
						'ctr'         => 2,
						'impressions' => 3,
						'keys'        => [ 'key1' ],
						'position'    => 4,
					],
					[
						'clicks'      => 5,
						'ctr'         => 6,
						'impressions' => 7,
						'keys'        => [ 'key2' ],
						'position'    => 8,
					],
				],
				'expected_results'        => [
					[
						'clicks'      => 1,
						'ctr'         => 2.0,
						'impressions' => 3,
						'position'    => 4.0,
						'subject'     => 'key1',
					],
					[
						'clicks'      => 5,
						'ctr'         => 6.0,
						'impressions' => 7,
						'position'    => 8.0,
						'subject'     => 'key2',
					],
				],
			],
			'Top queries with one result' => [
				'request_parameters'      => [
					'start_date' => '31-05-1988',
					'end_date'   => '06-03-2025',
					'dimensions' => [ 'query' ],
					'limit'      => 5,
				],
				'expected_api_parameters' => [
					'slug'       => 'search-console',
					'datapoint'  => 'searchanalytics',
					'startDate'  => '31-05-1988',
					'endDate'    => '06-03-2025',
					'dimensions' => [ 'query' ],
					'limit'      => 5,
				],
				'request_results'         => [
					[
						'clicks'      => 100,
						'ctr'         => 57.4,
						'impressions' => 3000,
						'keys'        => [ 'key1' ],
						'position'    => 4.4,
					],
				],
				'expected_results'        => [
					[
						'clicks'      => 100,
						'ctr'         => 57.4,
						'impressions' => 3000,
						'position'    => 4.4,
						'subject'     => 'key1',
					],
				],
			],
		];
	}
}
