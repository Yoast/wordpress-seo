<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Score_Groups\Readability_Score_Groups;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Bad_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Good_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Ok_Readability_Score_Group;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Readability Score Groups Repository tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Readability_Score_Groups_Repository_Test extends TestCase {

	/**
	 * The good readability score group.
	 *
	 * @var Good_Readability_Score_Group
	 */
	protected $good_readability_score_group;

	/**
	 * The ok readability score group.
	 *
	 * @var Ok_Readability_Score_Group
	 */
	protected $ok_readability_score_group;

	/**
	 * The bad readability score group.
	 *
	 * @var Bad_Readability_Score_Group
	 */
	protected $bad_readability_score_group;

	/**
	 * Holds the instance.
	 *
	 * @var Readability_Score_Groups_Repository
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->good_readability_score_group = new Good_Readability_Score_Group();
		$this->ok_readability_score_group   = new Ok_Readability_Score_Group();
		$this->bad_readability_score_group  = new Bad_Readability_Score_Group();

		$this->instance = new Readability_Score_Groups_Repository(
			$this->good_readability_score_group,
			$this->ok_readability_score_group,
			$this->bad_readability_score_group
		);
	}
}
