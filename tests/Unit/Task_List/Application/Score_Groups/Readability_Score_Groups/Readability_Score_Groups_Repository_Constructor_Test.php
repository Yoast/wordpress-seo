<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Score_Groups\Readability_Score_Groups;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Repository;

/**
 * Test class for the constructor.
 *
 * @group Readability_Score_Groups_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Repository::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Readability_Score_Groups_Repository_Constructor_Test extends Abstract_Readability_Score_Groups_Repository_Test {

	/**
	 * Tests if the instance is correctly constructed.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Readability_Score_Groups_Repository::class,
			$this->instance
		);
	}
}
