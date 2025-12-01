<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\User_Interface\Tasks;

use Exception;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Task_List_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Task_List\Application\Tasks_Repository;

/**
 * Get tasks route.
 */
final class Get_Tasks_Route implements Route_Interface {

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
	public const ROUTE_NAME = '/get_tasks';

	/**
	 * The task repository.
	 *
	 * @var Tasks_Repository
	 */
	private $tasks_repository;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [
			Task_List_Enabled_Conditional::class,
		];
	}

	/**
	 * The constructor.
	 *
	 * @param Tasks_Repository  $tasks_repository  The repository for all tasks.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct(
		Tasks_Repository $tasks_repository,
		Capability_Helper $capability_helper
	) {
		$this->tasks_repository  = $tasks_repository;
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
					'callback'            => [ $this, 'get_tasks' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'options' => [
							'type'       => 'object',
							'required'   => false,
							'properties' => [
								'filter' => [
									'type'              => 'string',
									'required'          => false,
									'sanitize_callback' => 'sanitize_text_field',
								],
								'limit' => [
									'type'              => 'int',
									'required'          => false,
									'sanitize_callback' => 'absint',
								],
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Gets tasks with their information.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_tasks(): WP_REST_Response {
		try {
			$tasks_data = $this->tasks_repository->get_tasks_data();
		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			[
				'success' => true,
				'tasks'   => $tasks_data,
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
