<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores;

/**
 * This class describes a missing readability score.
 */
class No_Readability_Score extends Abstract_Readability_Score {

	/**
	 * Gets the name of the readability score.
	 *
	 * @return string The name of the readability score.
	 */
	public function get_name(): string {
		return 'notAnalyzed';
	}

	/**
	 * Gets the name of the readability score that is used when filtering on the posts page.
	 *
	 * @return string The name of the readability score that is used when filtering on the posts page.
	 */
	public function get_filter_name(): string {
		return 'na';
	}

	/**
	 * Gets the position of the readability score.
	 *
	 * @return int The position of the readability score.
	 */
	public function get_position(): int {
		return 3;
	}

	/**
	 * Gets the minimum score of the readability score.
	 *
	 * @return null The minimum score of the readability score.
	 */
	public function get_min_score(): ?int {
		return null;
	}

	/**
	 * Gets the maximum score of the readability score.
	 *
	 * @return null The maximum score of the readability score.
	 */
	public function get_max_score(): ?int {
		return null;
	}
}
