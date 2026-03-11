<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Improve Default Meta Descriptions Child task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Improve_Abstract_Default_Meta_Descriptions_Child_Test extends TestCase {

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
	protected $content_item_data;

	/**
	 * Holds the instance.
	 *
	 * @var Improve_Default_Meta_Descriptions_Child
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

		$this->parent_task       = Mockery::mock( Parent_Task_Interface::class );
		$this->content_item_data = new Content_Item_Score_Data( 123, 'Test Post Title', '', 'post' );

		$this->instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$this->content_item_data,
		);
	}
}
