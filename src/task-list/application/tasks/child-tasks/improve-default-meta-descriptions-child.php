<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Represents a child task for a post or page missing a custom meta description.
 */
class Improve_Default_Meta_Descriptions_Child extends Abstract_Child_Task {

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 5;

	/**
	 * The content item score data.
	 *
	 * @var Content_Item_Score_Data
	 */
	private $content_item_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface  $parent_task       The parent task.
	 * @param Content_Item_Score_Data $content_item_data The content item data.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_Score_Data $content_item_data
	) {
		$this->parent_task       = $parent_task;
		$this->content_item_data = $content_item_data;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->parent_task->get_id() . '-' . $this->content_item_data->get_content_id();
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * Child tasks only exist for posts without a custom meta description, so they are always incomplete.
	 * Once a post has a description, it will no longer appear in the query results on the next cache refresh.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return false;
	}

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string {
		return 'medium';
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \get_edit_post_link( $this->content_item_data->get_content_id(), '&' );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		$link = $this->get_link();
		if ( $link !== null ) {
			$link = \add_query_arg(
				[
					'yoast-tab'       => 'seo',
					'yoast-scroll-to' => 'meta-description',
				],
				$link
			);
		}

		return new Call_To_Action_Entry(
			\__( 'Open social appearance', 'wordpress-seo' ),
			'link',
			$link,
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			\html_entity_decode( $this->content_item_data->get_title(), \ENT_QUOTES, 'UTF-8' ),
			$this->parent_task->get_copy_set()->get_about(),
		);
	}
}
