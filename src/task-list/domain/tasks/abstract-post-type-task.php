<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type task.
 */
abstract class Abstract_Post_Type_Task extends Abstract_Task implements Post_Type_Task_Interface {

	/**
	 * The post type associated with the task.
	 *
	 * @var string
	 */
	protected $post_type;

	/**
	 * Returns the post type associated with the task.
	 *
	 * @return string
	 */
	public function get_post_type(): string {
		return $this->post_type;
	}

	/**
	 * Sets the post type associated with the task.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function set_post_type( string $post_type ): void {
		$this->post_type = $post_type;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return parent::get_id() . '-' . $this->post_type;
	}

	/**
	 * Duplicates the task using a specific post type.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return Post_Type_Task_Interface
	 */
	public function duplicate_for_post_type( string $post_type ): Post_Type_Task_Interface {
		$clone = clone $this;
		$clone->set_post_type( $post_type );
		return $clone;
	}
}
