<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Generator\User_Interface;

use WP_REST_Response;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\New_Premium_Or_Free_AI_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get suggestions from the AI API
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Get_Usage_Route implements Route_Interface {

	use Route_Permission_Trait;

		/**
		 *  The namespace for this route.
		 *
		 * @var string
		 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 *  The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/ai_generator/get_usage';

	/**
	 * The auth strategy factory.
	 *
	 * @var AI_Request_Sender_Factory
	 */
	private $ai_request_sender_factory;

	/**
	 * Represents the add-on manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class, New_Premium_Or_Free_AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param AI_Request_Sender_Factory $ai_request_sender_factory The auth strategy factory.
	 * @param WPSEO_Addon_Manager       $addon_manager             The add-on manager instance.
	 */
	public function __construct( AI_Request_Sender_Factory $ai_request_sender_factory, WPSEO_Addon_Manager $addon_manager ) {
		$this->addon_manager             = $addon_manager;
		$this->ai_request_sender_factory = $ai_request_sender_factory;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				'methods'             => 'POST',
				'args'                => [
					'is_woo_product_entity' => [
						'type'        => 'boolean',
						'default'     => false,
					],
				],
				'callback'            => [ $this, 'get_usage' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	/**
	 * Runs the callback that gets the monthly usage of the user.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function get_usage( $request ): WP_REST_Response {
		$is_woo_product_entity = $request->get_param( 'is_woo_product_entity' );
		$user                  = \wp_get_current_user();
		try {
			$action_path = $this->get_action_path( $is_woo_product_entity );
			$sender      = $this->ai_request_sender_factory->create( $user );
			$response    = $sender->send( new Request( $action_path, [], [], false ), $user );
			$data        = \json_decode( $response->get_body() );
		} catch ( Remote_Request_Exception | WP_Request_Exception $e ) {
			$message = [
				'errorMessage'    => $e->getMessage(),
				'errorIdentifier' => $e->get_error_identifier(),
				'errorCode'       => $e->getCode(),
			];
			if ( $e instanceof Too_Many_Requests_Exception ) {
				$message['missingLicenses'] = $e->get_missing_licenses();
			}
			return new WP_REST_Response(
				$message,
				$e->getCode(),
			);
		}

		return new WP_REST_Response( $data );
	}

	/**
	 * Get action path for the request.
	 *
	 * @param bool $is_woo_product_entity Whether the request is for a WooCommerce product entity.
	 *
	 * @return string The action path.
	 */
	public function get_action_path( $is_woo_product_entity = false ): string {
		$unlimited = '/usage/' . \gmdate( 'Y-m' );
		if ( $is_woo_product_entity && $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ) ) {
			return $unlimited;
		}
		if ( ! $is_woo_product_entity && $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ) ) {
			return $unlimited;
		}
		return '/usage/free-usages';
	}
}
