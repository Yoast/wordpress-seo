<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Post_Type_Parent_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Child_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;

/**
 * Represents the task for improving content SEO.
 */
class Improve_Content_SEO extends Abstract_Post_Type_Parent_Task {

	/**
	 * The default maximum number of content items to retrieve.
	 *
	 * @var int
	 */
	public const DEFAULT_LIMIT = 100;

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'improve-content-seo';

	/**
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'medium';

	/**
	 * Holds the duration.
	 *
	 * @TODO: will be calculated dynamically, summing the duration of child tasks.
	 *
	 * @var int
	 */
	protected $duration = 15;

	/**
	 * Holds the recent content indexable collector.
	 *
	 * @var Recent_Content_Indexable_Collector
	 */
	private $recent_content_indexable_collector;

	/**
	 * Constructs the task.
	 *
	 * @param Recent_Content_Indexable_Collector $recent_content_indexable_collector The recent content indexable collector.
	 */
	public function __construct(
		Recent_Content_Indexable_Collector $recent_content_indexable_collector
	) {
		$this->recent_content_indexable_collector = $recent_content_indexable_collector;
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
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return null;
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		// @TODO: the copy in the task is very much WIP from the designing team, so let's deal with that later on.
		return new Copy_Set(
			\__( 'Improve your content\'s SEO', 'wordpress-seo' ),
			\__( 'Improving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems.', 'wordpress-seo' ),
			\__( 'Follow the instructions displayed in the SEO analysis to improve your content\'s SEO. Pro tip: Use AI Optimize to speed up the process with quality suggestions.', 'wordpress-seo' )
		);
	}

	/**
	 * Populates the child tasks by querying content modified in the last two months.
	 *
	 * @return Child_Task_Interface[]
	 */
	public function populate_child_tasks(): array {
		$post_type = $this->get_post_type();

		if ( empty( $post_type ) ) {
			return [];
		}

		$two_months_ago = \gmdate( 'Y-m-d H:i:s', \strtotime( '-2 months' ) );

		$recent_content_items = $this->recent_content_indexable_collector->get_recent_content_with_seo_scores(
			$post_type,
			$two_months_ago,
			self::DEFAULT_LIMIT
		);

		$child_tasks = [];
		foreach ( $recent_content_items as $content_item_seo_data ) {
			$child_tasks[] = new Improve_Content_SEO_Child(
				$this,
				$content_item_seo_data
			);
		}

		return $child_tasks;
	}

	/**
	 * Returns whether the task is valid.
	 *
	 * @TODO: disable if no indexables enabled, or no SEO analysis enabled.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		return true;
	}
}
