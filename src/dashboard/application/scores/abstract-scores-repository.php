<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Scores;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_List;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Score_Link_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Scores_Collector_Interface;

/**
 * The abstract scores repository.
 */
abstract class Abstract_Scores_Repository implements Scores_Repository_Interface {

	/**
	 * The scores collector.
	 *
	 * @var Scores_Collector_Interface
	 */
	protected $scores_collector;

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
	 * Returns the scores of a content type.
	 *
	 * @param Content_Type  $content_type The content type.
	 * @param Taxonomy|null $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int|null      $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The scores.
	 */
	public function get_scores( Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): array {
		$scores_list    = new Scores_List();
		$current_scores = $this->scores_collector->get_current_scores( $this->scores, $content_type, $term_id );

		foreach ( $this->scores as $score ) {
			$score_name = $score->get_name();
			$score->set_amount( (int) $current_scores->$score_name );
			$score->set_view_link( $this->score_link_collector->get_view_link( $score, $content_type, $taxonomy, $term_id ) );

			$scores_list->add( $score );
		}

		return $scores_list->to_array();
	}
}
