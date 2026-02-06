<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Score_Groups\Readability_Score_Groups;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\Abstract_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\No_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;

/**
 * The repository to get readability score groups.
 */
class Readability_Score_Groups_Repository extends Abstract_Score_Groups_Repository {

	/**
	 * The constructor.
	 *
	 * @param Readability_Score_Groups_Interface ...$readability_score_groups All readability score groups.
	 */
	public function __construct( Readability_Score_Groups_Interface ...$readability_score_groups ) {
		parent::__construct( ...$readability_score_groups );
	}

	/**
	 * Returns the score group to use when no score is available.
	 *
	 * @return Score_Groups_Interface The "no" score group.
	 */
	protected function get_no_score_group(): Score_Groups_Interface {
		return new No_Readability_Score_Group();
	}
}
