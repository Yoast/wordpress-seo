<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Score_Task_Analyzer;
use Yoast\WP\SEO\Task_List\Domain\Components\Task_Analyzer_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;

/**
 * Represents the child task for improving content SEO.
 */
class Improve_Content_SEO_Child extends Abstract_Child_Task {

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
			\__( 'Open editor', 'wordpress-seo' ),
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
		$result_labels = [
			'good' => \__( 'Good', 'wordpress-seo' ),
			'ok'   => \__( 'OK', 'wordpress-seo' ),
			'bad'  => \__( 'Needs improvement', 'wordpress-seo' ),
		];

		$result_descriptions = [
			'good' => \__( 'Your content is well optimized for search engines. This increases your chances of ranking higher in search results.', 'wordpress-seo' ),
			'ok'   => \__( 'Your content is partially optimized. Adding a few more SEO best practices will help you reach a wider audience.', 'wordpress-seo' ),
			'bad'  => \__( 'Your content is not yet optimized for search. Follow the SEO recommendations to help search engines understand and rank your page.', 'wordpress-seo' ),
		];

		$result = $this->content_item_score_data->get_score();

		return new Score_Task_Analyzer(
			\__( 'SEO analysis', 'wordpress-seo' ),
			$result,
			$result_labels[ $result ],
			$result_descriptions[ $result ],
		);
	}
}
