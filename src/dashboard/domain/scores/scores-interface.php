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

	/**
	 * Gets the amount of the score.
	 *
	 * @return int
	 */
	public function get_amount(): int;

	/**
	 * Sets the amount of the score.
	 *
	 * @param int $amount The amount of the score.
	 *
	 * @return void
	 */
	public function set_amount( int $amount ): void;

	/**
	 * Gets the view link of the score.
	 *
	 * @return string|null
	 */
	public function get_view_link(): ?string;

	/**
	 * Sets the view link of the score.
	 *
	 * @param string $view_link The view link of the score.
	 *
	 * @return void
	 */
	public function set_view_link( ?string $view_link ): void;
}
