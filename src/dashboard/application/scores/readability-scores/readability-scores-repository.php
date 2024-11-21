<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Application\Scores\Readability_Scores;

use Yoast\WP\SEO\Dashboard\Application\Scores\Scores_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Application\Scores\Scores_Repository_Trait;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores\Readability_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Readability_Scores\Readability_Scores_Collector;

/**
 * The repository to get readability scores.
 */
class Readability_Scores_Repository implements Scores_Repository_Interface {

	use Scores_Repository_Trait;

	/**
	 * The constructor.
	 *
	 * @param Readability_Scores_Collector $readability_scores_collector The readability scores collector.
	 * @param Readability_Scores_Interface ...$readability_scores        All readability scores.
	 */
	public function __construct(
		Readability_Scores_Collector $readability_scores_collector,
		Readability_Scores_Interface ...$readability_scores
	) {
		$this->scores_collector = $readability_scores_collector;
		$this->scores           = $readability_scores;
	}
}
