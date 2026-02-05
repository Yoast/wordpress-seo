<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Readability;

/**
 * Test class for the Improve Readability is_valid method.
 *
 * @group Improve_Readability
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::is_valid
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Readability_Is_Valid_Test extends Abstract_Improve_Readability_Test {

	/**
	 * Tests that the task is valid.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_true() {
		$this->assertTrue( $this->instance->is_valid() );
	}
}
