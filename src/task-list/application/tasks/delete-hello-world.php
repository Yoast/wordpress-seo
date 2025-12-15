<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use WP_Comment;
use WP_Post;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Complete_Hello_World_Task_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Completeable_Task;

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
	protected $priority = 'medium';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 1;

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$post = \get_post( 1 );
		if ( $post instanceof WP_Post === false || $post->post_status !== 'publish' ) {
			return true;
		}

		// Check if this is the actual Hello World post by checking the first comment.
		$comments = \get_comments(
			[
				'post_id' => 1,
				'number'  => 1,
				'order'   => 'ASC',
			]
		);

		if ( empty( $comments ) || \is_a( $comments[0], WP_Comment::class ) === false || $comments[0]->comment_author_email !== 'wapuu@wordpress.example' ) {
			// Not the Hello World post, so consider task completed.
			return true;
		}

		return $post->post_date !== $post->post_modified;
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
	 *
	 * @throws Complete_Hello_World_Task_Exception If the Hello World post could not be deleted.
	 */
	public function complete_task(): void {
		$post = \get_post( 1 );

		if ( $post instanceof WP_Post ) {
			$result = \wp_delete_post( $post->ID );

			if ( ! $result ) {
				throw new Complete_Hello_World_Task_Exception();
			}
		}
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return string|null
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Delete for me', 'wordpress-seo' ),
			'delete',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return string|null
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			\__( 'Remove the “Hello World” post', 'wordpress-seo' ),
			\__( 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.', 'wordpress-seo' ),
			null
		);
	}
}
