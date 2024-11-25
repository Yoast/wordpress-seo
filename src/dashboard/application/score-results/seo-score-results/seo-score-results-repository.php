<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Score_Results\SEO_Score_Results;

use Yoast\WP\SEO\Dashboard\Application\Score_Results\Abstract_Score_Results_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores\SEO_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\SEO_Score_Results\SEO_Score_Results_Collector;

/**
 * The repository to get SEO score results.
 */
class SEO_Score_Results_Repository extends Abstract_Score_Results_Repository {

	/**
	 * The constructor.
	 *
	 * @param SEO_Score_Results_Collector $seo_score_results_collector The SEO score results collector.
	 * @param SEO_Scores_Interface        ...$seo_scores               All SEO scores.
	 */
	public function __construct(
		SEO_Score_Results_Collector $seo_score_results_collector,
		SEO_Scores_Interface ...$seo_scores
	) {
		$this->score_results_collector = $seo_score_results_collector;
		$this->scores                  = $seo_scores;
	}
}
