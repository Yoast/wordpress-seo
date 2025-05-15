<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\User_Interface;

use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route toget suggestions from the AI API
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Consent_Route implements Route_Interface {

	use No_Conditionals;

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
	public const ROUTE_PREFIX = '/ai_generator/consent';

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
					'consent' => [
						'required'    => true,
						'type'        => 'boolean',
						'description' => 'Whether the consent to use AI-based services has been given by the user.',
					],
				],
				'callback'            => [ $this, 'consent' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			]
		);
	}

	/**
	 * Runs the callback to store the consent given by the user to use AI-based services.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function consent( WP_REST_Request $request ): WP_REST_Response {
		$user_id = \get_current_user_id();
		$consent = \boolval( $request['consent'] );

		try {
			$this->ai_generator_action->consent( $user_id, $consent );
		} catch ( Bad_Request_Exception | Forbidden_Exception | Internal_Server_Error_Exception | Not_Found_Exception | Payment_Required_Exception | Request_Timeout_Exception | Service_Unavailable_Exception | Too_Many_Requests_Exception | RuntimeException $e ) {
			return new WP_REST_Response( ( $consent ) ? 'Failed to store consent.' : 'Failed to revoke consent.', 500 );
		}

		return new WP_REST_Response( ( $consent ) ? 'Consent successfully stored.' : 'Consent successfully revoked.' );
	}

	/**
	 * Checks:
	 * - if the user is logged
	 * - if the user can edit posts
	 *
	 * @return bool Whether the user is logged in, can edit posts and the feature is active.
	 */
	public function check_permissions(): bool {
		$user = \wp_get_current_user();
		if ( $user === null || $user->ID < 1 ) {
			return false;
		}

		return \user_can( $user, 'edit_posts' );
	}
}
