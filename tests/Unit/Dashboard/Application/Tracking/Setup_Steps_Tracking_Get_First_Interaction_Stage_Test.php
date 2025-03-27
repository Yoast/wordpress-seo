<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Tracking;

/**
 * Test class for the get_first_interaction_stage method.
 *
 * @group setup_steps_tracking
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking::get_first_interaction_stage
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Get_First_Interaction_Stage_Test extends Abstract_Setup_Steps_Tracking_Test {

	/**
	 * Tests the retrieval of the first interaction step.
	 *
	 * @return void
	 */
	public function test_get_first_interaction_step() {
		$this->assertEquals( 'INSTALL', $this->instance->get_first_interaction_stage() );
	}
}
