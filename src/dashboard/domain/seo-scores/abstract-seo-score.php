<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\SEO_Scores;

/**
 * Abstract class for an SEO score.
 */
abstract class Abstract_SEO_Score implements SEO_Scores_Interface {

	/**
	 * The name of the SEO score.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The name of the SEO score that is used when filtering on the posts page.
	 *
	 * @var string
	 */
	private $filter_name;

	/**
	 * The min score of the SEO score.
	 *
	 * @var int
	 */
	private $min_score;

	/**
	 * The max score of the SEO score.
	 *
	 * @var int
	 */
	private $max_score;

	/**
	 * The amount of the SEO score.
	 *
	 * @var int
	 */
	private $amount;

	/**
	 * The view link of the SEO score.
	 *
	 * @var string
	 */
	private $view_link;

	/**
	 * The position of the score.
	 *
	 * @var int
	 */
	private $position;

	/**
	 * Gets the amount of the SEO score.
	 *
	 * @return int The amount of the SEO score.
	 */
	public function get_amount(): int {
		return $this->amount;
	}

	/**
	 * Sets the amount of the SEO score.
	 *
	 * @param int $amount The amount of the SEO score.
	 *
	 * @return void
	 */
	public function set_amount( int $amount ): void {
		$this->amount = $amount;
	}

	/**
	 * Gets the view link of the SEO score.
	 *
	 * @return string|null The view link of the SEO score.
	 */
	public function get_view_link(): ?string {
		return $this->view_link;
	}

	/**
	 * Sets the view link of the SEO score.
	 *
	 * @param string $view_link The view link of the SEO score.
	 *
	 * @return void
	 */
	public function set_view_link( ?string $view_link ): void {
		$this->view_link = $view_link;
	}
}
