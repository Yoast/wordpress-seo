<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Options\Network_Admin_Options_Action;
use Yoast\WP\SEO\Conditionals\Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;

/**
 * Network_Admin_Options_Route class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Route should not count.
 */
class Network_Admin_Options_Route implements Route_Interface {

	/**
	 * Holds the network admin options route.
	 *
	 * @var string
	 */
	const ROUTE = 'network-admin-options';

	/**
	 * Holds the full network admin options route.
	 *
	 * @var string
	 */
	const FULL_ROUTE = Main::API_V1_NAMESPACE . '/' . self::ROUTE;

	/**
	 * Holds the request argument name.
	 *
	 * @var string
	 */
	const ARGUMENT_NAME = 'options';

	/**
	 * Holds the Network_Admin_Options_Action instance.
	 *
	 * @var Network_Admin_Options_Action
	 */
	protected $network_admin_options_action;

	/**
	 * Holds the Capability_Helper instance.
	 *
	 * @var Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Constructs a Network_Admin_Options_Route instance.
	 *
	 * @param Network_Admin_Options_Action $network_admin_options_action The Network_Admin_Options_Action instance.
	 * @param Capability_Helper            $capability_helper            The Capability_Helper instance.
	 */
	public function __construct( Network_Admin_Options_Action $network_admin_options_action, Capability_Helper $capability_helper ) {
		$this->network_admin_options_action = $network_admin_options_action;
		$this->capability_helper            = $capability_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Multisite_Conditional::class ];
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get' ],
					'permission_callback' => [ $this, 'can_get' ],
					'args'                => [
						self::ARGUMENT_NAME => [
							'required' => false,
						],
					],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'set' ],
					'permission_callback' => [ $this, 'can_set' ],
				],
			]
		);
	}

	/**
	 * Retrieves the requested options.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response The get response.
	 */
	public function get( WP_REST_Request $request ) {
		$options = $request->get_param( self::ARGUMENT_NAME );
		if ( $options === null ) {
			// Change to requesting all options if no specific option was requested.
			$options = [];
		}
		$result = $this->network_admin_options_action->get( $options );

		return new WP_REST_Response( $result, 200 );
	}

	/**
	 * Sets the options.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The set response.
	 */
	public function set( WP_REST_Request $request ) {
		$options = $request->get_params();
		$result  = $this->network_admin_options_action->set( $options );

		if ( $result['success'] ) {
			return new WP_REST_Response( $result, 200 );
		}

		return new WP_REST_Response( $result, 400 );
	}

	/**
	 * Whether the current user is allowed to get.
	 *
	 * @return bool Whether the current user is allowed to get.
	 */
	public function can_get() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_network_options' );
	}

	/**
	 * Whether the current user is allowed to set.
	 *
	 * @return bool Whether the current user is allowed to set.
	 */
	public function can_set() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_network_options' );
	}
}
