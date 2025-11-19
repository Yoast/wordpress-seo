<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Represents a post type task.
 * Post type tasks are tasks that span throughout multiple post types.
 * A post type task is relevant for multiple post types and it will be represented by separate tasks in the frontend, one per post type.
 */
interface Post_Type_Task_Interface extends Task_Interface {

	/**
	 * Returns the post type associated with the task.
	 *
	 * @return string
	 */
	public function get_post_type(): string;

	/**
	 * Sets the post type associated with the task.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function set_post_type( string $post_type ): void;
}
