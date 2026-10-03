<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\Abstract_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\No_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface;

/**
 * The repository to get SEO score groups.
 */
class SEO_Score_Groups_Repository extends Abstract_Score_Groups_Repository {

	/**
	 * The constructor.
	 *
	 * @param SEO_Score_Groups_Interface ...$seo_score_groups All SEO score groups.
	 */
	public function __construct( SEO_Score_Groups_Interface ...$seo_score_groups ) {
		parent::__construct( ...$seo_score_groups );
	}

	/**
	 * Returns the score group to use when no score is available.
	 *
	 * @return Score_Groups_Interface The "no" score group.
	 */
	protected function get_no_score_group(): Score_Groups_Interface {
		return new No_SEO_Score_Group();
	}
}
