<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use DateTime;
use DateTimeZone;
use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Page_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Query_Repository;
use Yoast\WP\SEO\Dashboard\Application\Traffic\Organic_Sessions_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Time_Based_SEO_Metrics\Repository_Not_Found_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Abstract scores route.
 */
final class Time_Based_SEO_Metrics_Route implements Route_Interface {

	/**
	 * The namespace of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAME = '/time_based_seo_metrics';

	/**
	 * The data provider for page based search rankings.
	 *
	 * @var Top_Page_Repository $top_page_repository
	 */
	private $top_page_repository;

	/**
	 * The data provider for query based search rankings.
	 *
	 * @var Top_Query_Repository $top_query_repository
	 */
	private $top_query_repository;

	/**
	 * The data provider for organic session traffic.
	 *
	 * @var Organic_Sessions_Repository $organic_sessions_repository
	 */
	private $organic_sessions_repository;

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [ Google_Site_Kit_Feature_Conditional::class ];
	}

	/**
	 * The constructor.
	 *
	 * @param Top_Page_Repository         $top_page_repository         The data provider for page based search rankings.
	 * @param Top_Query_Repository        $top_query_repository        The data provider for query based search rankings.
	 * @param Organic_Sessions_Repository $organic_sessions_repository The data provider for organic session traffic.
	 */
	public function __construct(
		Top_Page_Repository $top_page_repository,
		Top_Query_Repository $top_query_repository,
		Organic_Sessions_Repository $organic_sessions_repository
	) {
		$this->top_page_repository         = $top_page_repository;
		$this->top_query_repository        = $top_query_repository;
		$this->organic_sessions_repository = $organic_sessions_repository;
	}

	/**
	 * Registers routes for scores.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_NAME,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_time_based_seo_metrics' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'limit'   => [
							'type'              => 'int',
							'sanitize_callback' => static function ( $param ) {
								return \intval( $param );
							},
							'default'           => 5,
						],
						'options' => [
							'type'       => 'object',
							'required'   => true,
							'properties' => [
								'widget' => [
									'type'              => 'string',
									'required'          => true,
									'sanitize_callback' => 'sanitize_text_field',
								],
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Gets the time based SEO metrics.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @throws Repository_Not_Found_Exception When the given widget name is not implemented yet.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_time_based_seo_metrics( WP_REST_Request $request ): WP_REST_Response {
		try {
			$date = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
			$date->modify( '-28 days' );
			$start_date = $date->format( 'Y-m-d' );

			$date = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
			$date->modify( '-1 days' );
			$end_date = $date->format( 'Y-m-d' );

			$widget_name = $request->get_param( 'options' )['widget'];
			switch ( $widget_name ) {
				case 'query':
					$request_parameters = new Search_Console_Parameters();
					$request_parameters->set_limit( $request->get_param( 'limit' ) );
					$request_parameters->set_dimensions( [ 'query' ] );
					$request_parameters->set_start_date( $start_date );
					$request_parameters->set_end_date( $end_date );

					$time_based_seo_metrics_container = $this->top_query_repository->get_data( $request_parameters );
					break;
				case 'page':
					$request_parameters = new Search_Console_Parameters();
					$request_parameters->set_limit( $request->get_param( 'limit' ) );
					$request_parameters->set_dimensions( [ 'page' ] );
					$request_parameters->set_start_date( $start_date );
					$request_parameters->set_end_date( $end_date );

					$time_based_seo_metrics_container = $this->top_page_repository->get_data( $request_parameters );
					break;
				case 'οrganicSessionsDaily':
					$request_parameters = new Analytics_4_Parameters();
					$request_parameters->set_dimensions( [ 'date' ] );
					$request_parameters->set_metrics( [ 'sessions' ] );
					$request_parameters->set_start_date( $start_date );
					$request_parameters->set_end_date( $end_date );
					$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );
					$request_parameters->set_order_by( 'dimension', 'date' );

					$time_based_seo_metrics_container = $this->organic_sessions_repository->get_data( $request_parameters );
					break;
				case 'οrganicSessionsChange':
					$request_parameters = new Analytics_4_Parameters();
					$request_parameters->set_metrics( [ 'sessions' ] );
					$request_parameters->set_start_date( $start_date );
					$request_parameters->set_end_date( $end_date );
					$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );

					$date = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
					$date->modify( '-29 days' );
					$compare_end_date = $date->format( 'Y-m-d' );

					$date->modify( '-27 days' );
					$compare_start_date = $date->format( 'Y-m-d' );
					$request_parameters->set_compare_start_date( $compare_start_date );
					$request_parameters->set_compare_end_date( $compare_end_date );

					$time_based_seo_metrics_container = $this->organic_sessions_repository->get_data( $request_parameters );
					break;
				default:
					throw new Repository_Not_Found_Exception();
			}
		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			$time_based_seo_metrics_container->to_array(),
			200
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has the 'wpseo_manage_options' capability.
	 */
	public function permission_manage_options() {
		return WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );
	}
}
