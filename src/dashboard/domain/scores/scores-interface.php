<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Scores;

/**
 * This interface describes a score implementation.
 */
interface Scores_Interface {

	/**
	 * Gets the name of the score.
	 *
	 * @return string
	 */
	public function get_name(): string;

	/**
	 * Gets the key of the score that is used when filtering on the posts page.
	 *
	 * @return string
	 */
	public function get_filter_key(): string;

	/**
	 * Gets the value of the score that is used when filtering on the posts page.
	 *
	 * @return string
	 */
	public function get_filter_value(): string;

	/**
	 * Gets the minimum score of the score.
	 *
	 * @return int
	 */
	public function get_min_score(): ?int;

	/**
	 * Gets the maximum score of the score.
	 *
	 * @return int
	 */
	public function get_max_score(): ?int;

	/**
	 * Gets the position of the score.
	 *
	 * @return int
	 */
	public function get_position(): int;
}
