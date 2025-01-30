<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use DateTime;
use DateTimeZone;
use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Repository_Not_Found_Exception;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Page_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Query_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Abstract scores route.
 */
final class Time_Based_Traffic_Route implements Route_Interface {

	/**
	 * The namespace of the rout.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAME = '/time_based_traffic';

	/**
	 * The data provider.
	 *
	 * @var Top_Page_Repository $top_page_repository
	 */
	private $top_page_repository;

	/**
	 * The data provider.
	 *
	 * @var Top_Query_Repository $top_query_repository
	 */
	private $top_query_repository;

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
	 * @param Top_Page_Repository  $top_page_repository  The data provider.
	 * @param Top_Query_Repository $top_query_repository The data provider.
	 */
	public function __construct(
		Top_Page_Repository $top_page_repository,
		Top_Query_Repository $top_query_repository
	) {
		$this->top_page_repository  = $top_page_repository;
		$this->top_query_repository = $top_query_repository;
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
					'callback'            => [ $this, 'get_time_based_traffic' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'limit'   => [
							'required'          => true,
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
									'type'     => 'string',
									'required' => true,
									'enum'     => [ 'query', 'page' ],
								],
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Gets the rankings of a specific amount of pages.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @throws Repository_Not_Found_Exception When the given widget name is not implemented yet.
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_time_based_traffic( WP_REST_Request $request ): WP_REST_Response {
		try {
			$request_parameters = new Search_Console_Parameters();
			$request_parameters->set_limit( $request->get_param( 'limit' ) );
			$date = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
			$date->modify( '-28 days' );

			$request_parameters->set_start_date( $date->format( 'Y-m-d' ) );
			$request_parameters->set_end_date( ( new DateTime( 'now', new DateTimeZone( 'UTC' ) ) )->format( 'Y-m-d' ) );

			$widget_name = $request->get_param( 'options' )['widget'];
			switch ( $widget_name ) {
				case 'query':
					$request_parameters->set_dimensions( [ 'query' ] );
					$search_rankings_container = $this->top_query_repository->get_data( $request_parameters );
					break;
				case 'page':
					$request_parameters->set_dimensions( [ 'page' ] );
					$search_rankings_container = $this->top_page_repository->get_data( $request_parameters );
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
			$search_rankings_container->to_array(),
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
