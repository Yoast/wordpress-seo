<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Settings_Introduction_Action;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Main;

/**
 * Settings_Introduction_Route class.
 */
class Settings_Introduction_Route implements Route_Interface {

	/**
	 * Represents the Settings_Introduction_Route prefix.
	 *
	 * @var string
	 */
	const ROUTE_PREFIX = '/settings_introduction';

	/**
	 * Represents the Wistia embed permission.
	 *
	 * @var string
	 */
	const WISTIA_EMBED_PERMISSION = self::ROUTE_PREFIX . '/wistia_embed_permission';

	/**
	 * Represents showing the introduction.
	 *
	 * @var string
	 */
	const SHOW = self::ROUTE_PREFIX . '/show';

	/**
	 * Holds the Settings_Introduction_Action.
	 *
	 * @var Settings_Introduction_Action
	 */
	private $settings_introduction_action;

	/**
	 * Constructs Settings_Introduction_Route.
	 *
	 * @param Settings_Introduction_Action $settings_introduction_action The $settings_introduction_action.
	 */
	public function __construct( Settings_Introduction_Action $settings_introduction_action ) {
		$this->settings_introduction_action = $settings_introduction_action;
	}

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Settings_Conditional::class ];
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has 'wpseo_manage_options' permission.
	 */
	public static function permission_manage_options() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::WISTIA_EMBED_PERMISSION,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_wistia_embed_permission' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'set_wistia_embed_permission' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'value' => [
							'required' => true,
							'type'     => 'bool',
						],
					],
				],
			]
		);

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::SHOW,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_show' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'set_show' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'value' => [
							'required' => true,
							'type'     => 'bool',
						],
					],
				],
			]
		);
	}

	/**
	 * Gets the value of the wistia embed permission.
	 *
	 * @return WP_REST_Response|WP_Error The response, or an error.
	 */
	public function get_wistia_embed_permission() {
		try {
			$value = $this->settings_introduction_action->get_wistia_embed_permission();
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_settings_introduction_error',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'json' => (object) [
					'value' => $value,
				],
			]
		);
	}

	/**
	 * Sets the value of the wistia embed permission.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function set_wistia_embed_permission( WP_REST_Request $request ) {
		$params = $request->get_json_params();
		$value  = \boolval( $params['value'] );

		try {
			$result = $this->settings_introduction_action->set_wistia_embed_permission( $value );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_settings_introduction_error',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'json' => (object) [
					'success' => $result,
				],
			],
			( $result ) ? 200 : 400
		);
	}

	/**
	 * Gets the value of show.
	 *
	 * @return WP_REST_Response|WP_Error The response, or an error.
	 */
	public function get_show() {
		try {
			$value = $this->settings_introduction_action->get_show();
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_settings_introduction_error',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'json' => (object) [
					'value' => $value,
				],
			]
		);
	}

	/**
	 * Sets the value of show.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function set_show( WP_REST_Request $request ) {
		$params = $request->get_json_params();
		$value  = \boolval( $params['value'] );

		try {
			$result = $this->settings_introduction_action->set_show( $value );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_settings_introduction_error',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'json' => (object) [
					'success' => $result,
				],
			],
			( $result ) ? 200 : 400
		);
	}
}
