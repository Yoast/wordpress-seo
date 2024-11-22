<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Scores\SEO_Scores;

use Yoast\WP\SEO\Dashboard\Application\Scores\Abstract_Scores_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores\SEO_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\SEO_Scores\SEO_Scores_Collector;

/**
 * The repository to get SEO Scores.
 */
class SEO_Scores_Repository extends Abstract_Scores_Repository {

	/**
	 * The constructor.
	 *
	 * @param SEO_Scores_Collector $seo_scores_collector The SEO scores collector.
	 * @param SEO_Scores_Interface ...$seo_scores        All SEO scores.
	 */
	public function __construct(
		SEO_Scores_Collector $seo_scores_collector,
		SEO_Scores_Interface ...$seo_scores
	) {
		$this->scores_collector = $seo_scores_collector;
		$this->scores           = $seo_scores;
	}
}
