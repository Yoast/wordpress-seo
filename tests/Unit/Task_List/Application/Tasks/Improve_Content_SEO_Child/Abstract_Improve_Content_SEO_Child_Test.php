<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
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
	 * The content item score data.
	 *
	 * @var Content_Item_Score_Data
	 */
	protected $content_item_score_data;

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

		$this->parent_task = Mockery::mock( Parent_Task_Interface::class );

		// Default content item with OK score.
		$this->content_item_score_data = new Content_Item_Score_Data( 123, 'Test Post Title', 'ok', 'post' );

		$this->instance = new Improve_Content_SEO_Child(
			$this->parent_task,
			$this->content_item_score_data
		);
	}

	/**
	 * Creates a child task instance with a specific score group.
	 *
	 * @param string $score The score group name (e.g., 'good', 'ok', 'bad').
	 *
	 * @return Improve_Content_SEO_Child
	 */
	protected function create_instance_with_score( string $score ): Improve_Content_SEO_Child {
		$content_item = new Content_Item_Score_Data( 123, 'Test Post Title', $score, 'post' );

		return new Improve_Content_SEO_Child(
			$this->parent_task,
			$content_item
		);
	}
}
