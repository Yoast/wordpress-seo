<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Post_Type_Task_Group;
use WP_Query;

/**
 * Represents the task for improving content SEO.
 */
class Improve_Content_SEO extends Abstract_Post_Type_Task_Group {

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
	 * @var int
	 */
	protected $duration = 15;

	/**
	 * Returns whether this task is completed.
	 * The group task is completed when all grouped tasks are completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$grouped_tasks = $this->get_grouped_tasks();

		if ( empty( $grouped_tasks ) ) {
			return true;
		}

		foreach ( $grouped_tasks as $task ) {
			if ( ! $task->get_is_completed() ) {
				return false;
			}
		}

		return true;
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
		return new Copy_Set(
			\__( 'Improve your content\'s SEO', 'wordpress-seo' ),
			\__( 'Improving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems.', 'wordpress-seo' ),
			\__( 'Follow the instructions displayed in the SEO analysis to improve your content\'s SEO. Pro tip: Use AI Optimize to speed up the process with quality suggestions.', 'wordpress-seo' )
		);
	}

	/**
	 * Populates the grouped tasks by querying content modified in the last two months.
	 *
	 * @return void
	 */
	public function populate_grouped_tasks(): void {
		$post_type = $this->get_post_type();

		if ( empty( $post_type ) ) {
			$this->set_grouped_tasks( [] );
			return;
		}

		$two_months_ago = \gmdate( 'Y-m-d H:i:s', \strtotime( '-2 months' ) );

		// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- We need to query for content without a focus keyphrase.
		$query = new WP_Query(
			[
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'date_query'     => [
					[
						'column' => 'post_modified',
						'after'  => $two_months_ago,
					],
				],
				'meta_query'     => [
					'relation' => 'OR',
					[
						'key'     => '_yoast_wpseo_focuskw',
						'compare' => 'NOT EXISTS',
					],
					[
						'key'     => '_yoast_wpseo_focuskw',
						'value'   => '',
						'compare' => '=',
					],
				],
				'orderby'        => 'modified',
				'order'          => 'DESC',
			]
		);

		$grouped_tasks = [];

		if ( $query->have_posts() ) {
			foreach ( $query->posts as $post ) {
				$grouped_tasks[] = new Improve_Content_Item_SEO( $this, $post );
			}
		}

		$this->set_grouped_tasks( $grouped_tasks );
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$grouped_tasks_data = [];
		foreach ( $this->get_grouped_tasks() as $grouped_task ) {
			$grouped_tasks_data[] = $grouped_task->to_array();
		}

		$data['groupedTasks']      = $grouped_tasks_data;
		$data['groupedTasksCount'] = \count( $grouped_tasks_data );

		return $data;
	}
}
