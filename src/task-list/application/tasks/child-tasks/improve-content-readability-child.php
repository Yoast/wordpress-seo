<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Score_Task_Analyzer;
use Yoast\WP\SEO\Task_List\Domain\Components\Task_Analyzer_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;

/**
 * Represents the child task for improving content readability.
 */
class Improve_Content_Readability_Child extends Abstract_Child_Task {

	use Content_Score_Child_Task_Trait;

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 10;

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Improve readability', 'wordpress-seo' ),
			'link',
			$this->get_link(),
		);
	}

	/**
	 * Returns the task's analyzer component.
	 *
	 * @return Task_Analyzer_Interface|null
	 */
	public function get_analyzer(): ?Task_Analyzer_Interface {
		$post_type_object = \get_post_type_object( $this->content_item_score_data->get_content_type() );
		$post_type_label  = \strtolower( $post_type_object->labels->singular_name );

		$result_labels = [
			'good' => \__( 'Good', 'wordpress-seo' ),
			'ok'   => \__( 'OK', 'wordpress-seo' ),
			'bad'  => \__( 'Needs improvement', 'wordpress-seo' ),
		];

		$result_descriptions = [
			/* translators: %s: The post type name (e.g., "post", "page", "product"). */
			'good' => \sprintf( \__( 'This %s\'s readability is looking good. Your content should be easy for readers to understand.', 'wordpress-seo' ), $post_type_label ),
			/* translators: %s: The post type name (e.g., "post", "page", "product"). */
			'ok'   => \sprintf( \__( 'This %s has some readability issues that could be improved to make it easier to read.', 'wordpress-seo' ), $post_type_label ),
			/* translators: %s: The post type name (e.g., "post", "page", "product"). */
			'bad'  => \sprintf( \__( 'This %s has one or more readability issues that may make it harder for readers to understand.', 'wordpress-seo' ), $post_type_label ),
		];

		$result = $this->content_item_score_data->get_score();

		return new Score_Task_Analyzer(
			\__( 'Readability', 'wordpress-seo' ),
			$result,
			$result_labels[ $result ],
			$result_descriptions[ $result ],
		);
	}
}
