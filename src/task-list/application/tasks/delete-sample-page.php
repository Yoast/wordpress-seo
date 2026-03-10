<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use WP_Post;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Complete_Sample_Page_Task_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;

/**
 * Represents the task for deleting the sample page.
 */
class Delete_Sample_Page extends Abstract_Task implements Completeable_Task_Interface {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'delete-sample-page';

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
		$page = $this->get_sample_page();

		if ( $page === null ) {
			return true;
		}

		return $page->post_date !== $page->post_modified;
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
	 * @throws Complete_Sample_Page_Task_Exception If the Sample Page could not be deleted.
	 */
	public function complete_task(): void {
		$page = $this->get_sample_page();

		if ( $page !== null ) {
			$result = \wp_delete_post( $page->ID );

			if ( ! $result ) {
				throw new Complete_Sample_Page_Task_Exception();
			}
		}
	}

	/**
	 * Returns the sample page if it exists and is published.
	 *
	 * @return WP_Post|null The sample page or null if not found.
	 */
	private function get_sample_page(): ?WP_Post {
		$pages = \get_posts(
			[
				'name'        => 'sample-page',
				'post_type'   => 'page',
				'post_status' => 'publish',
				'numberposts' => 1,
			],
		);

		if ( empty( $pages ) || $pages[0] instanceof WP_Post === false ) {
			return null;
		}

		return $pages[0];
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Delete for me', 'wordpress-seo' ),
			'delete',
			$this->get_link(),
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			\__( 'Remove the "Sample Page"', 'wordpress-seo' ),
			'<p>' . \__( 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.', 'wordpress-seo' ) . '</p>',
		);
	}
}
