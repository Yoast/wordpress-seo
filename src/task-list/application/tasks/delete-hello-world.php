<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use WP_Post;
use Yoast\WP\SEO\Task_List\Domain\Abstract_Completeable_Task;

/**
 * Represents the task for deleting the Hello World post.
 */
class Delete_Hello_World extends Abstract_Completeable_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'delete-hello-world';

	/**
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'normal';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 1;

	/**
	 * Returns the task's title.
	 *
	 * @return string|null
	 */
	public function get_title(): string {
		return \__( 'Remove the Hello World post', 'wordpress-seo' );
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		// @TODO: Test the detection code both in sites that have the post deleted but also in sites that have the post unmodified.
		$post = \get_post( 1 );
		if ( $post instanceof WP_Post === false || $post->post_status !== 'publish' ) {
			return false;
		}

		return $post->post_date === $post->post_modified;
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return null;
	}

	/**
	 * Completes a task.
	 *
	 * @return void
	 */
	public function complete_task(): void {
		// @TODO: Add some error handling here.
		$post = \get_post( 1 );
		if ( $post instanceof WP_Post ) {
			\wp_delete_post( $post->ID, true );
		}
	}
}
