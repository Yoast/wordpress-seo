<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Generation failure route.
 */
class Generation_Failure_Route implements Route_Interface {

	use No_Conditionals;

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
	public const ROUTE_NAME = '/llms_txt_generation_failure';

	/**
	 * Holds the file runner instance.
	 *
	 * @var File_Runner
	 */
	private $runner;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The constructor.
	 *
	 * @param File_Runner       $runner            The file runner.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct(
		File_Runner $runner,
		Capability_Helper $capability_helper
	) {
		$this->runner            = $runner;
		$this->capability_helper = $capability_helper;
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
					'callback'            => [ $this, 'get_generation_failure' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
				],
			]
		);
	}

	/**
	 * Gets the generation failure info.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_generation_failure(): WP_REST_Response {
		$this->runner->run();

		return new WP_REST_Response(
			[
				'generationFailure'       => ! $this->runner->is_successful(),
				'generationFailureReason' => $this->runner->get_generation_failure_reason(),
			],
			200
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has the 'wpseo_manage_options' capability.
	 */
	public function permission_manage_options() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}
}
