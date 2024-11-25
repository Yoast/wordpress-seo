<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Score_Results;

/**
 * This class describes a list of score results.
 */
class Current_Scores_List {

	/**
	 * The scores.
	 *
	 * @var Current_Score[]
	 */
	private $current_scores = [];

	/**
	 * Adds a current score to the list.
	 *
	 * @param Current_Score $current_score The current score to add.
	 *
	 * @return void
	 */
	public function add( Current_Score $current_score ): void {
		$this->current_scores[] = $current_score;
	}

	/**
	 * Parses the score list to the expected key value representation.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The score list presented as the expected key value representation.
	 */
	public function to_array(): array {
		$array = [];
		foreach ( $this->current_scores as $current_score ) {
			$array[] = [
				'name'   => $current_score->get_name(),
				'amount' => $current_score->get_amount(),
				'links'  => $current_score->get_links_to_array(),
			];
		}

		return $array;
	}
}
