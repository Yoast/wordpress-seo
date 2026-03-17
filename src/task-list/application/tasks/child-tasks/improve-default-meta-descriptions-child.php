<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Represents a child task for improving default meta descriptions.
 */
class Improve_Default_Meta_Descriptions_Child extends Abstract_Child_Task {

	use Child_Task_Trait {
		Child_Task_Trait::__construct as private base_construct;
	}

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 5;

	/**
	 * The meta description content item data.
	 *
	 * @var Meta_Description_Content_Item_Data
	 */
	private $meta_description_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface              $parent_task       The parent task.
	 * @param Meta_Description_Content_Item_Data $content_item_data The content item data.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Meta_Description_Content_Item_Data $content_item_data
	) {
		$this->base_construct( $parent_task, $content_item_data );
		$this->meta_description_data = $content_item_data;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * A child task is completed when the post has a custom meta description.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return $this->meta_description_data->has_description();
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
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Open editor', 'wordpress-seo' ),
			'link',
			$this->get_link(),
		);
	}
}
