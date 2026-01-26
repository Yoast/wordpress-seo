<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Represents the child task for improving content SEO.
 */
class Improve_Content_SEO_Child extends Abstract_Child_Task {

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 10;

	/**
	 * The content item SEO data.
	 *
	 * @var Content_Item_SEO_Data
	 */
	private $content_item_seo_data;

	/**
	 * The SEO score groups repository.
	 *
	 * @var SEO_Score_Groups_Repository
	 */
	private $seo_score_groups_repository;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface       $parent_task                 The parent task.
	 * @param Content_Item_SEO_Data       $content_item_seo_data       The content item SEO data.
	 * @param SEO_Score_Groups_Repository $seo_score_groups_repository The SEO score groups repository.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_SEO_Data $content_item_seo_data,
		SEO_Score_Groups_Repository $seo_score_groups_repository
	) {
		$this->parent_task                 = $parent_task;
		$this->content_item_seo_data       = $content_item_seo_data;
		$this->seo_score_groups_repository = $seo_score_groups_repository;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		// @TODO: probably improve this with inheritance.
		return $this->parent_task->get_id() . '-' . $this->content_item_seo_data->get_content_id();
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$score_group = $this->seo_score_groups_repository->get_seo_score_group(
			$this->content_item_seo_data->get_seo_score()
		);

		return $score_group->get_name() === 'good';
	}

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string {
		$score_group = $this->seo_score_groups_repository->get_seo_score_group(
			$this->content_item_seo_data->get_seo_score()
		);

		// Bad SEO scores get high priority, ok scores get medium priority.
		if ( $score_group->get_name() === 'bad' ) {
			return 'high';
		}

		return 'medium';
	}

	/**
	 * Returns the content item SEO data.
	 *
	 * @return Content_Item_SEO_Data
	 */
	public function get_content_item_seo_data(): Content_Item_SEO_Data {
		return $this->content_item_seo_data;
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \get_edit_post_link( $this->content_item_seo_data->get_content_id(), '&' );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Improve SEO', 'wordpress-seo' ),
			'edit',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		$title = $this->content_item_seo_data->get_title();

		return new Copy_Set(
			/* translators: %s: The content title. */
			\sprintf( \__( 'Improve SEO for "%s"', 'wordpress-seo' ), $title ),
			/* translators: %s: The content title. */
			\sprintf( \__( 'Optimize the SEO for "%s" to increase its visibility.', 'wordpress-seo' ), $title ),
			\__( 'Add a focus keyphrase and follow the SEO analysis recommendations to improve this content.', 'wordpress-seo' )
		);
	}
}
