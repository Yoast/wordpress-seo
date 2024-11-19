<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\SEO_Scores;

/**
 * This interface describes a SEO Score implementation.
 */
interface SEO_Scores_Interface {

	/**
	 * Gets the name of the SEO score.
	 *
	 * @return string
	 */
	public function get_name(): string;

	/**
	 * Gets the name of the SEO score that is used when filtering on the posts page.
	 *
	 * @return string
	 */
	public function get_filter_name(): string;

	/**
	 * Gets the minimum score of the SEO score.
	 *
	 * @return int
	 */
	public function get_min_score(): ?int;

	/**
	 * Gets the maximum score of the SEO score.
	 *
	 * @return int
	 */
	public function get_max_score(): ?int;

	/**
	 * Gets the position of the SEO score.
	 *
	 * @return int
	 */
	public function get_position(): int;

	/**
	 * Gets the amount of the SEO score.
	 *
	 * @return int
	 */
	public function get_amount(): int;

	/**
	 * Sets the amount of the SEO score.
	 *
	 * @param int $amount The amount of the SEO score.
	 *
	 * @return void
	 */
	public function set_amount( int $amount ): void;

	/**
	 * Gets the view link of the SEO score.
	 *
	 * @return string|null
	 */
	public function get_view_link(): ?string;

	/**
	 * Sets the view link of the SEO score.
	 *
	 * @param string $view_link The view link of the SEO score.
	 *
	 * @return void
	 */
	public function set_view_link( ?string $view_link ): void;
}
