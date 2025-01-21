<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Application\Sessions\Organic_Sessions_Data_Provider;
use Yoast\WP\SEO\Dashboard\Infrastructure\Google_Analytics\Google_Analytics_Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * organic sessions route.
 */
class Organic_Sessions_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * The namespace of the rout.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;
	/**
	 * The prefix of the rout.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/organic_sessions';

	/**
	 * The data provider.
	 *
	 * @var Organic_Sessions_Data_Provider $organic_sessions_data_provider
	 */
	private $organic_sessions_data_provider;

	/**
	 * The constructor.
	 *
	 * @param Organic_Sessions_Data_Provider $organic_sessions_data_provider The data provider.
	 */
	public function __construct( Organic_Sessions_Data_Provider $organic_sessions_data_provider ) {
		$this->organic_sessions_data_provider = $organic_sessions_data_provider;
	}

	/**
	 * Registers routes for scores.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_sessions' ],
					//'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'limit' => [
							'required'          => true,
							'type'              => 'int',
							'sanitize_callback' => 'sanitize_text_field',
							'default'           => 5,
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
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_sessions( WP_REST_Request $request ): WP_REST_Response {
		try {
			$request_parameters = new Google_Analytics_Parameters( ["sessionDefaultChannelGrouping" => "Organic Search"], [
				'name' => 'sessions',
			]);

			$request_parameters->set_limit( $request->get_param( 'limit' ) );
			$request_parameters->set_start_date( '2024-01-01' );
			$request_parameters->set_end_date( '2025-01-01' );

			$search_data_container = $this->organic_sessions_data_provider->get_data( $request_parameters );
		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			$search_data_container->to_array(),
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
