<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Scores\Readability_Scores;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores\Readability_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_List;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Readability_Scores\Readability_Scores_Collector;

/**
 * The repository to get readability Scores.
 */
class Readability_Scores_Repository {

	/**
	 * The readability scores collector.
	 *
	 * @var Readability_Scores_Collector
	 */
	private $readability_scores_collector;

	/**
	 * The scores list.
	 *
	 * @var Scores_List
	 */
	protected $scores_list;

	/**
	 * All readability scores.
	 *
	 * @var Readability_Scores_Interface[]
	 */
	private $readability_scores;

	/**
	 * The constructor.
	 *
	 * @param Readability_Scores_Collector $readability_scores_collector The readability scores collector.
	 * @param Scores_List                  $scores_list                  The scores list.
	 * @param Readability_Scores_Interface ...$readability_scores        All readability scores.
	 */
	public function __construct(
		Readability_Scores_Collector $readability_scores_collector,
		Scores_List $scores_list,
		Readability_Scores_Interface ...$readability_scores
	) {
		$this->readability_scores_collector = $readability_scores_collector;
		$this->scores_list                  = $scores_list;
		$this->readability_scores           = $readability_scores;
	}

	/**
	 * Returns the readability Scores of a content type.
	 *
	 * @param Content_Type  $content_type The content type.
	 * @param Taxonomy|null $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int|null      $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The readability scores.
	 */
	public function get_readability_scores( Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): array {
		$current_scores = $this->readability_scores_collector->get_readability_scores( $this->readability_scores, $content_type, $term_id );

		foreach ( $this->readability_scores as $readability_score ) {
			$readability_score->set_amount( (int) $current_scores[ $readability_score->get_name() ] );
			$readability_score->set_view_link( $this->readability_scores_collector->get_view_link( $readability_score, $content_type, $taxonomy, $term_id ) );

			$this->scores_list->add( $readability_score );
		}

		return $this->scores_list->to_array();
	}
}
