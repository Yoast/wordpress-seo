<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
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
	 * Holds the recent content indexable collector.
	 *
	 * @var Recent_Content_Indexable_Collector
	 */
	private $recent_content_indexable_collector;

	/**
	 * Holds the indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Holds the enabled analysis features repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * Constructs the task.
	 *
	 * @param Recent_Content_Indexable_Collector   $recent_content_indexable_collector   The recent content indexable collector.
	 * @param Indexable_Helper                     $indexable_helper                     The indexable helper.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 */
	public function __construct(
		Recent_Content_Indexable_Collector $recent_content_indexable_collector,
		Indexable_Helper $indexable_helper,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository
	) {
		$this->recent_content_indexable_collector   = $recent_content_indexable_collector;
		$this->indexable_helper                     = $indexable_helper;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
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
		$post_type = \get_post_type_object( $this->get_post_type() );

		return new Copy_Set(
			/* translators: %1$s expands to the post type label this task is about */
			\sprintf( \__( 'Improve the SEO of your content type: %1$s', 'wordpress-seo' ), $post_type->label ),
			\sprintf(
				/* translators: %1$s expands to an opening p tag, %2$s and %4$s expand to a closing p tag, %3$s expands to an opening p tag and opening strong tag, %5$s expands to a closing strong tag, %6$s expands to an opening strong tag, %7$s expands to a closing strong tag and closing p tag */
				\__( '%1$sImproving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems. Follow the instructions displayed in the SEO analysis to improve your content\'s SEO.%2$s%3$sPro tip%5$s: Use %6$sAI Optimize%7$s to speed up the process with high-quality, actionable suggestions.%4$s', 'wordpress-seo' ),
				'<p>',
				'</p>',
				'<p><strong>',
				'</p>',
				'</strong>',
				'<strong>',
				'</strong>'
			)
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
		foreach ( $recent_content_items as $content_item_score_data ) {
			$child_tasks[] = new Improve_Content_SEO_Child(
				$this,
				$content_item_score_data
			);
		}

		return $child_tasks;
	}

	/**
	 * Returns whether the task is valid.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		if ( ! $this->indexable_helper->should_index_indexables() ) {
			return false;
		}

		$enabled_features = $this->enabled_analysis_features_repository->get_enabled_features()->to_array();
		if ( ! isset( $enabled_features[ Keyphrase_Analysis::NAME ] ) || $enabled_features[ Keyphrase_Analysis::NAME ] === false ) {
			return false;
		}

		return true;
	}
}
