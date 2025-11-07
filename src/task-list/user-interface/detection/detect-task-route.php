<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\User_Interface\Detection;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Task_List\Application\Tasks_Collector;
use Yoast\WP\SEO\Task_List\Domain\Task_Not_Found_Exception;

/**
 * Tasks route.
 */
final class Detect_Task_Route implements Route_Interface {

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
	public const ROUTE_NAME = '/detect_task';

	/**
	 * The task collector.
	 *
	 * @var Tasks_Collector
	 */
	private $tasks_collector;

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
		return [];
	}

	/**
	 * The constructor.
	 *
	 * @param Tasks_Collector   $tasks_collector   The collector for all tasks.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct(
		Tasks_Collector $tasks_collector,
		Capability_Helper $capability_helper
	) {
		$this->tasks_collector   = $tasks_collector;
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
					'callback'            => [ $this, 'detect_task' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'options' => [
							'type'       => 'object',
							'required'   => true,
							'properties' => [
								'task' => [
									'type'              => 'string',
									'required'          => true,
									'sanitize_callback' => 'sanitize_text_field',
								],
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Detects whether a task is completed.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 *
	 * @throws Task_Not_Found_Exception When the given task name is not implemented yet.
	 */
	public function detect_task( WP_REST_Request $request ): WP_REST_Response {
		try {
			$task_name = $request->get_param( 'options' )['task'];
			$task      = $this->tasks_collector->get_task( $task_name );

			if ( ! $task ) {
				throw new Task_Not_Found_Exception();
			}
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
				'success'     => true,
				'isCompleted' => $task->get_is_completed(),
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
