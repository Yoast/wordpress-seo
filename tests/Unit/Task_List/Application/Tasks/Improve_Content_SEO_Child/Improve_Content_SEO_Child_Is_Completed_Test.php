<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface;

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
	 * Tests that task is completed when repository returns a score group with name 'good'.
	 *
	 * @return void
	 */
	public function test_is_completed_when_score_group_name_is_good() {
		$score_group = Mockery::mock( SEO_Score_Groups_Interface::class );
		$score_group->expects( 'get_name' )->andReturn( 'good' );

		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->andReturn( $score_group );

		$this->assertTrue( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when repository returns a score group with name 'bad'.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_group_name_is_bad() {
		$score_group = Mockery::mock( SEO_Score_Groups_Interface::class );
		$score_group->expects( 'get_name' )->andReturn( 'bad' );

		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->andReturn( $score_group );

		$this->assertFalse( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when repository returns a score group with name 'ok'.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_group_name_is_ok() {
		$score_group = Mockery::mock( SEO_Score_Groups_Interface::class );
		$score_group->expects( 'get_name' )->andReturn( 'ok' );

		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->andReturn( $score_group );

		$this->assertFalse( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that task is not completed when repository returns a score group with any other name.
	 *
	 * @return void
	 */
	public function test_is_not_completed_when_score_group_name_is_anything_else() {
		$score_group = Mockery::mock( SEO_Score_Groups_Interface::class );
		$score_group->expects( 'get_name' )->andReturn( 'unknown' );

		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->andReturn( $score_group );

		$this->assertFalse( $this->instance->get_is_completed() );
	}
}
