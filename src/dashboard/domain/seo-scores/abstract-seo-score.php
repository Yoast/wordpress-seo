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
	 * The amount of the SEO score.
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
	 * The min score of the SEO score.
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
	 * Sets the view link of the SEO score.
	 *
	 * @param string $view_link The view link of the SEO score.
	 *
	 * @return void
	 */
	public function set_view_link( string $view_link ): void {
		$this->view_link = $view_link;
	}

	/**
	 * Parses the SEO score to the expected key value representation.
	 *
	 * @return array<string, string|array<string, string>> The SEO score presented as the expected key value representation.
	 */
	public function to_array(): array {
		return [
			'name'   => $this->get_name(),
			'amount' => $this->amount,
			'links'  => [
				'view' => $this->view_link,
			],
		];
	}
}
