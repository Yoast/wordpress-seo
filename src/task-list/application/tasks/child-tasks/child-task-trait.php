<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Data_Interface;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Incorrect_Child_Trait_Usage_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Trait for shared child task functionality.
 * Provides implementations common to all child tasks that use a Content_Item_Data_Interface.
 */
trait Child_Task_Trait {

	/**
	 * The content item data.
	 *
	 * @var Content_Item_Data_Interface
	 */
	protected $content_item_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface       $parent_task       The parent task.
	 * @param Content_Item_Data_Interface $content_item_data The content item data.
	 *
	 * @throws Incorrect_Child_Trait_Usage_Exception If the class using this trait is not an Abstract_Child_Task.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_Data_Interface $content_item_data
	) {
		if ( ! $this instanceof Abstract_Child_Task ) {
			throw new Incorrect_Child_Trait_Usage_Exception();
		}

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
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \get_edit_post_link( $this->content_item_data->get_content_id(), '&' );
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
