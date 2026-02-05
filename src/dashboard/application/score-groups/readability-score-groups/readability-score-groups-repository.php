<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Score_Groups\Readability_Score_Groups;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\No_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface;

/**
 * The repository to get readability score groups.
 * @TODO: This class is very similar to the SEO_Score_Groups_Repository. Consider refactoring to a generic Score_Groups_Repository that can be used for both SEO and readability score groups.
 */
class Readability_Score_Groups_Repository {

	/**
	 * All readability score groups.
	 *
	 * @var Readability_Score_Groups_Interface[]
	 */
	private $readability_score_groups;

	/**
	 * The constructor.
	 *
	 * @param Readability_Score_Groups_Interface ...$readability_score_groups All readability score groups.
	 */
	public function __construct( Readability_Score_Groups_Interface ...$readability_score_groups ) {
		$this->readability_score_groups = $readability_score_groups;
	}

	/**
	 * Returns the readability score group that a readability score belongs to.
	 *
	 * @param int|null $readability_score The readability score to be assigned into a group.
	 *
	 * @return Readability_Score_Groups_Interface The readability score group that the readability score belongs to.
	 */
	public function get_readability_score_group( ?int $readability_score ): Readability_Score_Groups_Interface {
		// @TODO: Check if having 0 as readability score should actually get you to the no readability score group.  
		if ( $readability_score === null || $readability_score === 0 ) {
			return new No_Readability_Score_Group();
		}

		foreach ( $this->readability_score_groups as $readability_score_group ) {
			if ( $readability_score_group->get_max_score() === null ) {
				continue;
			}

			if ( $readability_score >= $readability_score_group->get_min_score() && $readability_score <= $readability_score_group->get_max_score() ) {
				return $readability_score_group;
			}
		}

		return new No_Readability_Score_Group();
	}
}
