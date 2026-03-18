<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Post_Type_Parent_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Child_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;

/**
 * Represents the task for setting custom meta descriptions on recent content.
 */
class Improve_Default_Meta_Descriptions extends Abstract_Post_Type_Parent_Task {

	use Recent_Content_Task_Trait;

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
	protected $id = 'improve-default-meta-descriptions';

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
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the task.
	 *
	 * @param Recent_Content_Indexable_Collector $recent_content_indexable_collector The recent content indexable collector.
	 * @param Indexable_Helper                   $indexable_helper                   The indexable helper.
	 * @param Options_Helper                     $options_helper                     The options helper.
	 */
	public function __construct(
		Recent_Content_Indexable_Collector $recent_content_indexable_collector,
		Indexable_Helper $indexable_helper,
		Options_Helper $options_helper
	) {
		$this->recent_content_indexable_collector = $recent_content_indexable_collector;
		$this->indexable_helper                   = $indexable_helper;
		$this->options_helper                     = $options_helper;
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
		$post_type = \get_post_type_object( $this->get_post_type() );

		return new Copy_Set(
			/* translators: %1$s expands to the post type label this task is about */
			\sprintf( \__( 'Improve default meta descriptions of your recent content: %1$s', 'wordpress-seo' ), $post_type->label ),
			\sprintf(
				/* translators: %1$s expands to <p>, %2$s expands to </p>, %3$s expands to <p>, %4$s expands to </p>, %5$s expands to <strong>, %6$s expands to </strong>, %7$s expands to <strong> and %8$s expands to </strong>. */
				\__( '%1$sDefault meta descriptions don\'t always highlight what makes your page unique. Write your own to improve clarity and drive more clicks.%2$s%3$sShort on time? In %5$sYoast SEO Premium%6$s, use %7$sAI Generate%8$s to create tailored meta descriptions in seconds.%4$s', 'wordpress-seo' ),
				'<p>',
				'</p>',
				'<p>',
				'</p>',
				'<strong>',
				'</strong>',
				'<strong>',
				'</strong>',
			),
		);
	}

	/**
	 * Populates the child tasks by querying content modified in the last two months.
	 *
	 * @return Child_Task_Interface[]
	 */
	public function populate_child_tasks(): array {
		// @TODO: There's a lot of code duplication that can be abstracted in all the parent tasks so far.
		$post_type = $this->get_post_type();

		if ( empty( $post_type ) ) {
			return [];
		}

		$two_months_ago = $this->get_recency_timestamp();

		$recent_content_items = $this->recent_content_indexable_collector->get_recent_content_for_meta_descriptions(
			$post_type,
			$two_months_ago,
			self::DEFAULT_LIMIT,
		);

		$child_tasks = [];
		foreach ( $recent_content_items as $content_item_data ) {
			$child_tasks[] = new Improve_Default_Meta_Descriptions_Child(
				$this,
				$content_item_data,
			);
		}

		return $child_tasks;
	}

	/**
	 * Returns whether the task is valid.
	 *
	 * The task is only shown when:
	 * - Indexables are being indexed.
	 * - The global meta description template for this post type is empty or contains only hardcoded text without replacevars.
	 *   If it contains even one replacevar (%%...%%), descriptions can be considered customised in each post and the task is unnecessary.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		if ( ! $this->indexable_helper->should_index_indexables() ) {
			return false;
		}

		$metadesc = $this->options_helper->get( 'metadesc-' . $this->get_post_type() );

		if ( empty( $metadesc ) ) {
			return true;
		}

		// If the template contains at least one replacevar (%%...%%), the task is not valid.
		return ! (bool) \preg_match( '/%%[^%]+%%/', $metadesc );
	}
}
