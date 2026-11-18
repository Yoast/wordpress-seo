<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Score_Groups;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;

/**
 * Abstract repository to get score groups for a given score.
 * Used for both SEO and readability score groups.
 */
abstract class Abstract_Score_Groups_Repository {

	/**
	 * All score groups.
	 *
	 * @var Score_Groups_Interface[]
	 */
	private $score_groups;

	/**
	 * The constructor.
	 *
	 * @param Score_Groups_Interface ...$score_groups All score groups.
	 */
	public function __construct( Score_Groups_Interface ...$score_groups ) {
		$this->score_groups = $score_groups;
	}

	/**
	 * Returns the score group to use when no score is available.
	 *
	 * @return Score_Groups_Interface The "no" score group.
	 */
	abstract protected function get_no_score_group(): Score_Groups_Interface;

	/**
	 * Returns the score group that a score belongs to.
	 *
	 * @param int|null $score The score to be assigned into a group.
	 *
	 * @return Score_Groups_Interface The score group that the score belongs to.
	 */
	public function get_score_group( ?int $score ): Score_Groups_Interface {
		if ( $score === null || $score === 0 ) {
			return $this->get_no_score_group();
		}

		foreach ( $this->score_groups as $score_group ) {
			if ( $score_group->get_max_score() === null ) {
				continue;
			}

			if ( $score >= $score_group->get_min_score() && $score <= $score_group->get_max_score() ) {
				return $score_group;
			}
		}

		return $this->get_no_score_group();
	}
}
