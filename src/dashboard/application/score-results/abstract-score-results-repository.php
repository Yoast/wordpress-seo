<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Score_Results;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Scores_List;
use Yoast\WP\SEO\Dashboard\Domain\Score_Results\Score_Result;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Score_Results_Collector_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Score_Link_Collector;

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
	 * The score link collector.
	 *
	 * @var Score_Link_Collector
	 */
	protected $score_link_collector;

	/**
	 * All scores.
	 *
	 * @var Scores_Interface[]
	 */
	protected $scores;

	/**
	 * Sets the score link collector.
	 *
	 * @required
	 *
	 * @param Score_Link_Collector $score_link_collector The score link collector.
	 *
	 * @return void
	 */
	public function set_score_link_collector(
		Score_Link_Collector $score_link_collector
	) {
		$this->score_link_collector = $score_link_collector;
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
		$current_scores      = $this->score_results_collector->get_current_scores( $this->scores, $content_type, $term_id );

		foreach ( $this->scores as $score ) {
			$score_name          = $score->get_name();
			$current_score_links = [
				'view' => $this->score_link_collector->get_view_link( $score, $content_type, $taxonomy, $term_id ),
			];

			$current_score = new Current_Score( $score_name, (int) $current_scores['scores']->$score_name, $current_score_links );
			$current_scores_list->add( $current_score );
		}

		$score_result = new Score_Result( $current_scores_list, $current_scores['query_time'], $current_scores['cache_used'] );

		return $score_result->to_array();
	}
}
