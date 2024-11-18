<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\SEO_Scores;

/**
 * This class describes an OK SEO score.
 */
class Ok_SEO_Score extends Abstract_SEO_Score {

	/**
	 * Gets the name of the SEO score.
	 *
	 * @return string The the name of the SEO score.
	 */
	public function get_name(): string {
		return 'ok';
	}

	/**
	 * Gets the minimum score of the SEO score.
	 *
	 * @return int The minimum score of the SEO score.
	 */
	public function get_min_score(): ?int {
		return 41;
	}

	/**
	 * Gets the maximum score of the SEO score.
	 *
	 * @return int The maximum score of the SEO score.
	 */
	public function get_max_score(): ?int {
		return 70;
	}
}
