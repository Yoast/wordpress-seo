<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Mockery;
use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Bad_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Good_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Improve Content SEO Child task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Improve_Content_SEO_Child_Test extends TestCase {

	/**
	 * The parent task mock.
	 *
	 * @var Mockery\MockInterface|Parent_Task_Interface
	 */
	protected $parent_task;

	/**
	 * The content item SEO data.
	 *
	 * @var Content_Item_SEO_Data
	 */
	protected $content_item_seo_data;

	/**
	 * The SEO score groups repository mock.
	 *
	 * @var Mockery\MockInterface|SEO_Score_Groups_Repository
	 */
	protected $seo_score_groups_repository;

	/**
	 * Holds the instance.
	 *
	 * @var Improve_Content_SEO_Child
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->parent_task                 = Mockery::mock( Parent_Task_Interface::class );
		$this->seo_score_groups_repository = Mockery::mock( SEO_Score_Groups_Repository::class );

		// Default content item with OK score (55).
		$this->content_item_seo_data = new Content_Item_SEO_Data( 123, 'Test Post Title', 55, 'post' );

		$this->instance = new Improve_Content_SEO_Child(
			$this->parent_task,
			$this->content_item_seo_data,
			$this->seo_score_groups_repository
		);
	}

	/**
	 * Creates a child task instance with a specific SEO score.
	 *
	 * @param int $seo_score The SEO score.
	 *
	 * @return Improve_Content_SEO_Child
	 */
	protected function create_instance_with_score( int $seo_score ): Improve_Content_SEO_Child {
		$content_item = new Content_Item_SEO_Data( 123, 'Test Post Title', $seo_score, 'post' );

		return new Improve_Content_SEO_Child(
			$this->parent_task,
			$content_item,
			$this->seo_score_groups_repository
		);
	}

	/**
	 * Sets up the repository to return a Bad_SEO_Score_Group.
	 *
	 * @param int $score The score to expect.
	 *
	 * @return void
	 */
	protected function expect_bad_score_group( int $score ): void {
		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->with( $score )
			->andReturn( new Bad_SEO_Score_Group() );
	}

	/**
	 * Sets up the repository to return an Ok_SEO_Score_Group.
	 *
	 * @param int $score The score to expect.
	 *
	 * @return void
	 */
	protected function expect_ok_score_group( int $score ): void {
		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->with( $score )
			->andReturn( new Ok_SEO_Score_Group() );
	}

	/**
	 * Sets up the repository to return a Good_SEO_Score_Group.
	 *
	 * @param int $score The score to expect.
	 *
	 * @return void
	 */
	protected function expect_good_score_group( int $score ): void {
		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->with( $score )
			->andReturn( new Good_SEO_Score_Group() );
	}
}
