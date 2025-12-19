<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure;

use Yoast\WP\SEO\Conditionals\Task_List_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Invalid_Post_Type_Tasks_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;

/**
 * Handles registering post type tasks.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Register_Post_Type_Tasks_Integration implements Integration_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper $post_type_helper The post type helper.
	 */
	private $post_type_helper;

	/**
	 * Holds all the post type tasks.
	 *
	 * @var Post_Type_Task_Interface[]
	 */
	private $post_type_tasks;

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
	 * @param Post_Type_Task_Interface ...$post_type_tasks The post type tasks.
	 */
	public function __construct( Post_Type_Task_Interface ...$post_type_tasks ) {
		$this->post_type_tasks = $post_type_tasks;
	}

	/**
	 * Sets the post type helper for the post type tasks.
	 *
	 * @required
	 *
	 * @codeCoverageIgnore - Is handled by DI-container.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 *
	 * @return void
	 */
	public function set_post_type_helper( Post_Type_Helper $post_type_helper ) {
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'wpseo_task_list_tasks', [ $this, 'register_post_type_tasks' ] );
	}

	/**
	 * Gets the post type tasks.
	 *
	 * @return array<string, array<string, Post_Type_Task_Interface>> The tasks.
	 *
	 * @throws Invalid_Post_Type_Tasks_Exception If any of the filtered tasks is invalid.
	 */
	private function get_post_type_tasks(): array {
		// Remove this line when we decide to re-instate the search appearance post type tasks.
		$this->post_type_tasks = [];

		/**
		 * Filter: 'wpseo_task_list_post_type_tasks' - Allows adding more post type tasks to the task list.
		 *
		 * @param array<string, array<string, Post_Type_Task_Interface>> $tasks The post type tasks for the task list.
		 *
		 * @internal
		 */
		$final_post_type_tasks = \apply_filters( 'wpseo_task_list_post_type_tasks', $this->post_type_tasks );

		// Check that every item is an instance of Post_Type_Task_Interface.
		foreach ( $final_post_type_tasks as $task ) {
			if ( ! $task instanceof Post_Type_Task_Interface ) {
				throw new Invalid_Post_Type_Tasks_Exception();
			}
		}

		return $final_post_type_tasks;
	}

	/**
	 * Adds the post type tasks in the task collector.
	 *
	 * @param array<string, array<string, Post_Type_Task_Interface>> $existing_tasks Currently set tasks.
	 *
	 * @return array<string, array<string, Post_Type_Task_Interface>> Tasks with added post type tasks.
	 */
	public function register_post_type_tasks( $existing_tasks ) {
		$post_types = $this->post_type_helper->get_public_post_types();
		$post_types = \array_intersect( $post_types, [ 'post', 'page', 'product' ] );

		$tasks = [];
		foreach ( $this->get_post_type_tasks() as $task ) {
			foreach ( $post_types as $post_type ) {
				$task_copy = $task->duplicate_for_post_type( $post_type );
				$tasks[]   = $task_copy;
			}
		}

		return \array_merge( $existing_tasks, $tasks );
	}
}
