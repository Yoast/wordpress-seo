<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\User_Interface\Tasks;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Task_List_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Task_Not_Found_Exception;
use Yoast\WP\SEO\Task_List\Infrastructure\Manual_Task_Completion_Repository;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Route to manually set a task as completed (or revert to automatic completion).
 */
final class Manually_Complete_Task_Route implements Route_Interface {

	/**
	 * The namespace of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The route name.
	 *
	 * @var string
	 */
	public const ROUTE_NAME = '/manually_complete_task';

	/**
	 * The tasks collector.
	 *
	 * @var Tasks_Collector
	 */
	private $tasks_collector;

	/**
	 * The manual task completion repository.
	 *
	 * @var Manual_Task_Completion_Repository
	 */
	private $manual_task_completion_repository;

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
	 * @param Tasks_Collector                   $tasks_collector                   The collector for all tasks.
	 * @param Manual_Task_Completion_Repository $manual_task_completion_repository The manual task completion repository.
	 * @param Capability_Helper                 $capability_helper                 The capability helper.
	 */
	public function __construct(
		Tasks_Collector $tasks_collector,
		Manual_Task_Completion_Repository $manual_task_completion_repository,
		Capability_Helper $capability_helper
	) {
		$this->tasks_collector                   = $tasks_collector;
		$this->manual_task_completion_repository = $manual_task_completion_repository;
		$this->capability_helper                 = $capability_helper;
	}

	/**
	 * Registers routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_NAME,
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'manually_complete_task' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'options' => [
							'type'       => 'object',
							'required'   => true,
							'properties' => [
								'task_id'   => [
									'type'              => 'string',
									'required'          => true,
									'sanitize_callback' => 'sanitize_text_field',
								],
								'completed' => [
									'type'     => 'boolean',
									'required' => true,
								],
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Sets a task's manual completion state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response The response.
	 *
	 * @throws Task_Not_Found_Exception When the task is not found.
	 */
	public function manually_complete_task( WP_REST_Request $request ): WP_REST_Response {
		try {
			$options   = $request->get_param( 'options' );
			$task_id   = $options['task_id'];
			$completed = $options['completed'];

			$task = $this->tasks_collector->get_task( $task_id );
			if ( ! $task ) {
				throw new Task_Not_Found_Exception();
			}

			if ( $completed ) {
				$this->manual_task_completion_repository->set_task_manually_completed( $task_id );
			}
			else {
				$this->manual_task_completion_repository->clear_task_manual_completion( $task_id );
			}

			// Invalidate cached task list.
			\delete_transient( Cached_Tasks_Collector::TASKS_TRANSIENT );

			return new WP_REST_Response(
				[
					'success' => true,
				],
				200
			);
		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}
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
