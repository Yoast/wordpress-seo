<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Configuration;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to set whether the Site Kit configuration is permanently dismissed.
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Kit_Consent_Management_Route implements Route_Interface {

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
	public const ROUTE_PREFIX = '/site_kit_manage_consent';

	/**
	 * Holds the repository instance.
	 *
	 * @var Site_Kit_Consent_Repository_Interface
	 */
	private $site_kit_consent_repository;

	/**
	 * Constructs the class.
	 *
	 * @param Site_Kit_Consent_Repository_Interface $site_kit_consent_repository The repository.
	 */
	public function __construct(
		Site_Kit_Consent_Repository_Interface $site_kit_consent_repository
	) {
		$this->site_kit_consent_repository = $site_kit_consent_repository;
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
					'callback'            => [ $this, 'set_site_kit_consent' ],
					'permission_callback' => [ $this, 'check_capabilities' ],
					'args'                => [
						'consent' => [
							'required'          => true,
							'type'              => 'bool',
							'sanitize_callback' => 'rest_sanitize_boolean',
						],

					],
				],
			]
		);
	}

	/**
	 * Sets whether the Site Kit configuration is permanently dismissed.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function set_site_kit_consent( WP_REST_Request $request ) {
		$consent = $request->get_param( 'consent' );

		try {
			$result = $this->site_kit_consent_repository->set_site_kit_consent( $consent );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_set_site_kit_consent_error',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'success' => $result,
			],
			( $result ) ? 200 : 400
		);
	}

	/**
	 * Checks if the current user has the required capabilities.
	 *
	 * @return bool
	 */
	public function check_capabilities() {
		return \current_user_can( 'install_plugins' );
	}
}
