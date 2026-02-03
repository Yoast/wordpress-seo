<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

/**
 * Tests the get_priority method of the Improve Content SEO Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_priority
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Child_Get_Priority_Test extends Abstract_Improve_Content_SEO_Child_Test {

	/**
	 * Tests that a task with a bad SEO score has high priority.
	 *
	 * @return void
	 */
	public function test_bad_score_has_high_priority() {
		$instance = $this->create_instance_with_score( 'bad' );

		$this->assertSame( 'high', $instance->get_priority() );
	}

	/**
	 * Tests that a task with an ok SEO score has medium priority.
	 *
	 * @return void
	 */
	public function test_ok_score_has_medium_priority() {
		$instance = $this->create_instance_with_score( 'ok' );

		$this->assertSame( 'medium', $instance->get_priority() );
	}

	/**
	 * Tests that a task with a good SEO score has medium priority.
	 *
	 * This is an edge case since good scores should be completed.
	 *
	 * @return void
	 */
	public function test_good_score_has_medium_priority() {
		$instance = $this->create_instance_with_score( 'good' );

		$this->assertSame( 'medium', $instance->get_priority() );
	}
}
