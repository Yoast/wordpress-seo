<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Grouped_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Group_Interface;
use WP_Post;

/**
 * Represents a grouped task for improving a specific content item's SEO.
 */
class Improve_Content_Item_SEO extends Abstract_Grouped_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'improve-content-item-seo';

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
	protected $duration = 10;

	/**
	 * Holds the content type of the item.
	 *
	 * @var string
	 */
	protected $content_type = '';

	/**
	 * Holds the content item associated with this task.
	 *
	 * @var WP_Post
	 */
	protected $content_item;

	/**
	 * Constructs the task.
	 *
	 * @param Task_Group_Interface $task_group   The parent task group.
	 * @param string               $content_type The content type to improve.
	 */
	public function __construct( Task_Group_Interface $task_group, WP_Post $post ) {
		$this->task_group   = $task_group;
		$this->content_type = $task_group->get_post_type();
		$this->content_item = $post;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id . '-' . $this->content_item->ID;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		// A content item is considered "completed" when it has a good SEO score.
		// For now, we check if it has a focus keyphrase set.
		$focus_keyphrase = \get_post_meta( $this->content_item->ID, '_yoast_wpseo_focuskw', true );

		return ! empty( $focus_keyphrase );
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \get_edit_post_link( $this->content_item->ID, 'raw' );
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
		return new Copy_Set(
			/* translators: %s: The content title. */
			\sprintf( \__( 'Improve SEO for "%s"', 'wordpress-seo' ), $this->content_item->post_title ),
			/* translators: %s: The content title. */
			\sprintf( \__( 'Optimize the SEO for "%s" to increase its visibility.', 'wordpress-seo' ), $this->content_item->post_title ),
			\__( 'Add a focus keyphrase and follow the SEO analysis recommendations to improve this content.', 'wordpress-seo' )
		);
	}

	// /**
	//  * Returns an array representation of the task data.
	//  *
	//  * @return array<string, string|bool> Returns in an array format.
	//  */
	// public function to_array(): array {
	// 	$data = parent::to_array();

	// 	$data['contentId']    = $this->content->ID;
	// 	$data['contentTitle'] = $this->content->post_title;
	// 	$data['contentType']  = $this->content->post_type;
	// 	$data['groupId']      = $this->get_task_group()->get_id();

	// 	return $data;
	// }
}
