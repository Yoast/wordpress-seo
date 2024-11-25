<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores;

/**
 * This class describes a missing SEO score.
 */
class No_SEO_Score extends Abstract_SEO_Score {

	/**
	 * Gets the name of the SEO score.
	 *
	 * @return string The name of the SEO score.
	 */
	public function get_name(): string {
		return 'notAnalyzed';
	}

	/**
	 * Gets the value of the SEO score that is used when filtering on the posts page.
	 *
	 * @return string The name of the SEO score that is used when filtering on the posts page.
	 */
	public function get_filter_value(): string {
		return 'na';
	}

	/**
	 * Gets the position of the SEO score.
	 *
	 * @return int The position of the SEO score.
	 */
	public function get_position(): int {
		return 3;
	}

	/**
	 * Gets the minimum score of the SEO score.
	 *
	 * @return null The minimum score of the SEO score.
	 */
	public function get_min_score(): ?int {
		return null;
	}

	/**
	 * Gets the maximum score of the SEO score.
	 *
	 * @return null The maximum score of the SEO score.
	 */
	public function get_max_score(): ?int {
		return null;
	}
}
