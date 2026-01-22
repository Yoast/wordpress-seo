<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Color_Task_Indicator;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Components\Task_Indicator_Interface;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Represents the child task for improving content SEO.
 */
class Improve_Content_SEO_Child extends Abstract_Child_Task {

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
	 * The content item data.
	 *
	 * @var Content_Item_Data
	 */
	private $content_item_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface $parent_task       The parent task.
	 * @param Content_Item_Data     $content_item_data The content item data.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_Data $content_item_data
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
		// @TODO: probably improve this with inheritance.
		return $this->parent_task->get_id() . '-' . $this->content_item_data->get_content_id();
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return $this->content_item_data->has_good_seo_score();
	}

	/**
	 * Returns the content item data.
	 *
	 * @return Content_Item_Data
	 */
	public function get_content_item_data(): Content_Item_Data {
		return $this->content_item_data;
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
		$title = $this->content_item_data->get_title();

		return new Copy_Set(
			/* translators: %s: The content title. */
			\sprintf( \__( 'Improve SEO for "%s"', 'wordpress-seo' ), $title ),
			/* translators: %s: The content title. */
			\sprintf( \__( 'Optimize the SEO for "%s" to increase its visibility.', 'wordpress-seo' ), $title ),
			\__( 'Add a focus keyphrase and follow the SEO analysis recommendations to improve this content.', 'wordpress-seo' )
		);
	}

	/**
	 * Returns the indicator for this task.
	 *
	 * @return Task_Indicator_Interface|null
	 */
	public function get_indicator(): ?Task_Indicator_Interface {
		$seo_score = $this->content_item_data->get_seo_score();

		if ( $seo_score >= 70 ) {
			return new Color_Task_Indicator( Color_Task_Indicator::COLOR_GREEN, \__( 'Good SEO score', 'wordpress-seo' ) );
		}

		if ( $seo_score >= 40 ) {
			return new Color_Task_Indicator( Color_Task_Indicator::COLOR_YELLOW, \__( 'Needs improvement', 'wordpress-seo' ) );
		}

		return new Color_Task_Indicator( Color_Task_Indicator::COLOR_RED, \__( 'Poor SEO score', 'wordpress-seo' ) );
	}
}
