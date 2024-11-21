<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Scores;

/**
 * This class describes a list of scores.
 */
class Scores_List {

	/**
	 * The scores.
	 *
	 * @var Scores_Interface[]
	 */
	private $scores = [];

	/**
	 * Adds a score to the list.
	 *
	 * @param Scores_Interface $score The score to add.
	 *
	 * @return void
	 */
	public function add( Scores_Interface $score ): void {
		$this->scores[] = $score;
	}

	/**
	 * Parses the score list to the expected key value representation.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The score list presented as the expected key value representation.
	 */
	public function to_array(): array {
		$array = [];
		foreach ( $this->scores as $score ) {
			$array[ $score->get_position() ] = [
				'name'   => $score->get_name(),
				'amount' => $score->get_amount(),
				'links'  => ( $score->get_view_link() === null ) ? [] : [ 'view' => $score->get_view_link() ],
			];
		}

		\ksort( $array );

		return $array;
	}
}
