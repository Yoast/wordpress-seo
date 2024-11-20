<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\SEO_Scores;

/**
 * This class describes a list of SEO scores.
 */
class SEO_Scores_List {

	/**
	 * The SEO scores.
	 *
	 * @var array<SEO_Scores_Interface>
	 */
	private $seo_scores = [];

	/**
	 * Adds an SEO score to the list.
	 *
	 * @param SEO_Scores_Interface $seo_score The SEO score to add.
	 *
	 * @return void
	 */
	public function add( SEO_Scores_Interface $seo_score ): void {
		$this->seo_scores[] = $seo_score;
	}

	/**
	 * Parses the SEO score list to the expected key value representation.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The SEO score list presented as the expected key value representation.
	 */
	public function to_array(): array {
		$array = [];
		foreach ( $this->seo_scores as $seo_score ) {
			$array[ $seo_score->get_position() ] = [
				'name'   => $seo_score->get_name(),
				'amount' => $seo_score->get_amount(),
				'links'  => ( $seo_score->get_view_link() === null ) ? [] : [ 'view' => $seo_score->get_view_link() ],
			];
		}

		\ksort( $array );

		return $array;
	}
}
