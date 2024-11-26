<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Score_Results;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Scores_List;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Score_Result;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Score_Results_Collector_Interface;

/**
 * The abstract score results repository.
 */
abstract class Abstract_Score_Results_Repository {

	/**
	 * The score results collector.
	 *
	 * @var Score_Results_Collector_Interface
	 */
	protected $score_results_collector;

	/**
	 * The score group link collector.
	 *
	 * @var Score_Group_Link_Collector
	 */
	protected $score_group_link_collector;

	/**
	 * All score groups.
	 *
	 * @var Score_Groups_Interface[]
	 */
	protected $score_groups;

	/**
	 * Sets the score link collector.
	 *
	 * @required
	 *
	 * @param Score_Group_Link_Collector $score_group_link_collector The score group link collector.
	 *
	 * @return void
	 */
	public function set_score_group_link_collector(
		Score_Group_Link_Collector $score_group_link_collector
	) {
		$this->score_group_link_collector = $score_group_link_collector;
	}

	/**
	 * Returns the score results for a content type.
	 *
	 * @param Content_Type  $content_type The content type.
	 * @param Taxonomy|null $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int|null      $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The scores.
	 */
	public function get_score_results( Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): array {
		$current_scores_list = new Current_Scores_List();
		$score_results       = $this->score_results_collector->get_score_results( $this->score_groups, $content_type, $term_id );

		foreach ( $this->score_groups as $score_group ) {
			$score_name          = $score_group->get_name();
			$current_score_links = [
				'view' => $this->score_group_link_collector->get_view_link( $score_group, $content_type, $taxonomy, $term_id ),
			];

			$current_score = new Current_Score( $score_name, (int) $score_results['scores']->$score_name, $current_score_links );
			$current_scores_list->add( $current_score, $score_group->get_position() );
		}

		$score_result = new Score_Result( $current_scores_list, $score_results['query_time'], $score_results['cache_used'] );

		return $score_result->to_array();
	}
}
