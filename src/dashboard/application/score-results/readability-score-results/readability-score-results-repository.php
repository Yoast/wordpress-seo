<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Score_Results\Readability_Score_Results;

use Yoast\WP\SEO\Dashboard\Application\Score_Results\Abstract_Score_Results_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores\Readability_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Readability_Score_Results\Readability_Score_Results_Collector;

/**
 * The repository to get readability score results.
 */
class Readability_Score_Results_Repository extends Abstract_Score_Results_Repository {

	/**
	 * The constructor.
	 *
	 * @param Readability_Score_Results_Collector $readability_score_results_collector The readability score results collector.
	 * @param Readability_Scores_Interface        ...$readability_scores               All readability scores.
	 */
	public function __construct(
		Readability_Score_Results_Collector $readability_score_results_collector,
		Readability_Scores_Interface ...$readability_scores
	) {
		$this->score_results_collector = $readability_score_results_collector;
		$this->scores                  = $readability_scores;
	}
}
