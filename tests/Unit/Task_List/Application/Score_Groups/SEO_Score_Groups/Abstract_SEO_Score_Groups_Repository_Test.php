<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Score_Groups\SEO_Score_Groups;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Bad_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Good_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the SEO Score Groups Repository tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_SEO_Score_Groups_Repository_Test extends TestCase {

	/**
	 * The good SEO score group.
	 *
	 * @var Good_SEO_Score_Group
	 */
	protected $good_seo_score_group;

	/**
	 * The ok SEO score group.
	 *
	 * @var Ok_SEO_Score_Group
	 */
	protected $ok_seo_score_group;

	/**
	 * The bad SEO score group.
	 *
	 * @var Bad_SEO_Score_Group
	 */
	protected $bad_seo_score_group;

	/**
	 * Holds the instance.
	 *
	 * @var SEO_Score_Groups_Repository
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->good_seo_score_group = new Good_SEO_Score_Group();
		$this->ok_seo_score_group   = new Ok_SEO_Score_Group();
		$this->bad_seo_score_group  = new Bad_SEO_Score_Group();

		$this->instance = new SEO_Score_Groups_Repository(
			$this->good_seo_score_group,
			$this->ok_seo_score_group,
			$this->bad_seo_score_group
		);
	}
}
