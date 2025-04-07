<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use DateTime;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the get_time_based_seo_metrics method.
 *
 * @group time_based_SEO_metrics_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::get_time_based_seo_metrics
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::set_date_range_parameters
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::set_comparison_date_range_parameters
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Route_Get_Metrics_Test extends Abstract_Time_Based_SEO_Metrics_Route_Test {

	/**
	 * Tests get_time_based_seo_metrics.
	 *
	 * @dataProvider data_get_time_based_seo_metrics
	 *
	 * @param string $widget                         The asked widget.
	 * @param int    $top_pages_count                The times we ask for the top pages repository.
	 * @param int    $top_queries_count              The times we ask for the top queries repository.
	 * @param int    $organic_sessions_daily_count   The times we ask for the organic sessions daily repository.
	 * @param int    $organic_sessions_compare_count The times we ask for the organic sessions compare repository.
	 * @param int    $search_ranking_compare_count   The times we ask for the search ranking compare repository.
	 *
	 * @return void
	 */
	public function test_get_time_based_seo_metrics(
		$widget,
		$top_pages_count,
		$top_queries_count,
		$organic_sessions_daily_count,
		$organic_sessions_compare_count,
		$search_ranking_compare_count
	) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$data_container_mock   = Mockery::mock( Data_Container::class );

		$data_container_mock
			->expects( 'to_array' )
			->once()
			->andReturn( [] );

		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[],
				200
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'options' )
			->andReturn( [ 'widget' => $widget ] );

		$this->top_page_repository
			->expects( 'get_data' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) {

						return $request_parameters instanceof Search_Console_Parameters
						&& $request_parameters->get_limit() === 5
						&& $request_parameters->get_dimensions() === [ 'page' ]
						&& self::has_27_days_interval( $request_parameters );
					}
				)
			)
			->times( $top_pages_count )
			->andReturn( $data_container_mock );

		$this->top_query_repository
			->expects( 'get_data' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) {

						return $request_parameters instanceof Search_Console_Parameters
						&& $request_parameters->get_limit() === 5
						&& $request_parameters->get_dimensions() === [ 'query' ]
						&& self::has_27_days_interval( $request_parameters );
					}
				)
			)
			->times( $top_queries_count )
			->andReturn( $data_container_mock );

		$this->organic_sessions_compare_repository
			->expects( 'get_data' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) {

						return $request_parameters instanceof Analytics_4_Parameters
						&& $request_parameters->get_metrics() === [ [ 'name' => 'sessions' ] ]
						&& $request_parameters->get_dimension_filters() === [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ]
						&& self::has_27_days_interval( $request_parameters )
						&& self::has_27_days_compare_interval( $request_parameters );
					}
				)
			)
			->times( $organic_sessions_compare_count )
			->andReturn( $data_container_mock );

		$this->organic_sessions_daily_repository
			->expects( 'get_data' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) {
						$order_by = [
							[ 'dimension' => [ 'dimensionName' => 'date' ] ],
						];

						return $request_parameters instanceof Analytics_4_Parameters
						&& $request_parameters->get_dimensions() === [ [ 'name' => 'date' ] ]
						&& $request_parameters->get_metrics() === [ [ 'name' => 'sessions' ] ]
						&& $request_parameters->get_dimension_filters() === [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ]
						&& $request_parameters->get_order_by() === $order_by
						&& self::has_27_days_interval( $request_parameters );
					}
				)
			)
			->times( $organic_sessions_daily_count )
			->andReturn( $data_container_mock );

		$this->search_ranking_compare_repository
			->expects( 'get_data' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) {

						return $request_parameters instanceof Search_Console_Parameters
						&& $request_parameters->get_dimensions() === [ 'date' ]
						&& self::has_27_days_interval( $request_parameters )
						&& self::has_27_days_compare_interval( $request_parameters );
					}
				)
			)
			->times( $search_ranking_compare_count )
			->andReturn( $data_container_mock );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'limit' )
			->times( ( $top_queries_count === 1 || $top_pages_count === 1 ) ? 1 : 0 )
			->andReturn( 5 );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_time_based_seo_metrics( $wp_rest_request )
		);
	}

	/**
	 * Checks if the start date and end date have an interval of 27 days.
	 *
	 * @param Parameters $request_parameters The request parameters.
	 *
	 * @return bool
	 */
	public static function has_27_days_interval( Parameters $request_parameters ) {
		$start_date = new DateTime( $request_parameters->get_start_date() );
		$end_date   = new DateTime( $request_parameters->get_end_date() );
		$interval   = $start_date->diff( $end_date );

		return $interval->days === 27;
	}

	/**
	 * Checks if the compare start date and compare end date have an interval of 27 days.
	 *
	 * @param Parameters $request_parameters The request parameters.
	 *
	 * @return bool
	 */
	public static function has_27_days_compare_interval( Parameters $request_parameters ) {
		$start_date = new DateTime( $request_parameters->get_compare_start_date() );
		$end_date   = new DateTime( $request_parameters->get_compare_end_date() );
		$interval   = $start_date->diff( $end_date );

		return $interval->days === 27;
	}

	/**
	 * Data provider for test_get_time_based_seo_metrics.
	 *
	 * @return array<string, array<string|int>>
	 */
	public static function data_get_time_based_seo_metrics() {
		return [
			'Top pages route'          => [
				'page',
				1,
				0,
				0,
				0,
				0,
			],
			'Top queries route'        => [
				'query',
				0,
				1,
				0,
				0,
				0,
			],
			'Daily organic sessions'   => [
				'organicSessionsDaily',
				0,
				0,
				1,
				0,
				0,
			],
			'Compare organic sessions' => [
				'organicSessionsCompare',
				0,
				0,
				0,
				1,
				0,
			],
			'Compare search rankings'  => [
				'searchRankingCompare',
				0,
				0,
				0,
				0,
				1,
			],
		];
	}
}
