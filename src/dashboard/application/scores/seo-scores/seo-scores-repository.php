<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Scores\SEO_Scores;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_List;
use Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores\SEO_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Score_Link_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\SEO_Scores\SEO_Scores_Collector;

/**
 * The repository to get SEO Scores.
 */
class SEO_Scores_Repository {

	/**
	 * The SEO scores collector.
	 *
	 * @var SEO_Scores_Collector
	 */
	private $seo_scores_collector;

	/**
	 * The score link collector.
	 *
	 * @var Score_Link_Collector
	 */
	private $score_link_collector;

	/**
	 * The scores list.
	 *
	 * @var Scores_List
	 */
	protected $scores_list;

	/**
	 * All SEO scores.
	 *
	 * @var SEO_Scores_Interface[]
	 */
	private $seo_scores;

	/**
	 * The constructor.
	 *
	 * @param SEO_Scores_Collector $seo_scores_collector The SEO scores collector.
	 * @param Score_Link_Collector $score_link_collector The score link collector.
	 * @param Scores_List          $scores_list          The scores list.
	 * @param SEO_Scores_Interface ...$seo_scores        All SEO scores.
	 */
	public function __construct(
		SEO_Scores_Collector $seo_scores_collector,
		Score_Link_Collector $score_link_collector,
		Scores_List $scores_list,
		SEO_Scores_Interface ...$seo_scores
	) {
		$this->seo_scores_collector = $seo_scores_collector;
		$this->score_link_collector = $score_link_collector;
		$this->scores_list          = $scores_list;
		$this->seo_scores           = $seo_scores;
	}

	/**
	 * Returns the SEO Scores of a content type.
	 *
	 * @param Content_Type  $content_type The content type.
	 * @param Taxonomy|null $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int|null      $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The SEO scores.
	 */
	public function get_seo_scores( Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): array {
		$current_scores = $this->seo_scores_collector->get_seo_scores( $this->seo_scores, $content_type, $term_id );

		foreach ( $this->seo_scores as $seo_score ) {
			$seo_score->set_amount( (int) $current_scores[ $seo_score->get_name() ] );
			$seo_score->set_view_link( $this->score_link_collector->get_view_link( $seo_score, $content_type, $taxonomy, $term_id ) );

			$this->scores_list->add( $seo_score );
		}

		return $this->scores_list->to_array();
	}
}
