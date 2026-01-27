<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

/**
 * Tests the get_is_completed method of the Improve Content SEO Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_is_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Child_Is_Completed_Test extends Abstract_Improve_Content_SEO_Child_Test {

	/**
	 * Tests that task is completed when score is 'good'.
	 *
	 * @return void
	 */
	public function test_is_completed_when_score_is_good() {
		$instance = $this->create_instance_with_score( 'good' );

		$this->assertTrue( $instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when score is 'bad'.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_is_bad() {
		$instance = $this->create_instance_with_score( 'bad' );

		$this->assertFalse( $instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when score is 'ok'.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_is_ok() {
		$instance = $this->create_instance_with_score( 'ok' );

		$this->assertFalse( $instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when score is any other value.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_is_anything_else() {
		$instance = $this->create_instance_with_score( 'unknown' );

		$this->assertFalse( $instance->get_is_completed() );
	}
}
