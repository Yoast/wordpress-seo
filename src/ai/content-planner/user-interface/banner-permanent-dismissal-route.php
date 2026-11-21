<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\AI\Content_Planner\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to permanently dismiss the AI Content Planner inline banner for the current user.
 */
class Banner_Permanent_Dismissal_Route implements Route_Interface {

	/**
	 * The user meta key used to store the permanent dismissal state.
	 *
	 * @var string
	 */
	public const USER_META_KEY = '_yoast_wpseo_ai_content_planner_banner_permanently_dismissed';

	/**
	 * The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/ai_content_planner/banner_permanent_dismissal';

	/**
	 * Holds the user helper instance.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Gets the conditionals required to load this class.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param User_Helper $user_helper The user helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct( User_Helper $user_helper ) {
		$this->user_helper = $user_helper;
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
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'set_banner_permanent_dismissal' ],
					'permission_callback' => [ $this, 'check_capabilities' ],
					'args'                => [
						'is_dismissed' => [
							'required'          => true,
							'type'              => 'bool',
							'sanitize_callback' => 'rest_sanitize_boolean',
						],
					],
				],
			],
		);
	}

	/**
	 * Permanently dismisses the AI Content Planner banner for the current user.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function set_banner_permanent_dismissal( WP_REST_Request $request ) {
		$is_dismissed = $request->get_param( 'is_dismissed' );
		$user_id      = $this->user_helper->get_current_user_id();
		$result       = $this->user_helper->update_meta( $user_id, self::USER_META_KEY, $is_dismissed );

		// update_meta returns false both on failure and when the stored value is already identical.
		// Check the existing value to distinguish the two cases and keep the endpoint idempotent.
		if ( $result === false ) {
			$existing = $this->user_helper->get_meta( $user_id, self::USER_META_KEY, true );
			$result   = ( (bool) $existing === (bool) $is_dismissed );
		}

		return new WP_REST_Response(
			[
				'success' => (bool) $result,
			],
			( $result !== false ) ? 200 : 400,
		);
	}

	/**
	 * Checks if the current user has the required capabilities.
	 *
	 * @return bool
	 */
	public function check_capabilities() {
		return \current_user_can( 'edit_posts' );
	}
}
