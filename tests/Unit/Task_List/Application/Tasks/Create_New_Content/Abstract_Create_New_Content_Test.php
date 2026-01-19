<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Create_New_Content;

use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Complete FTC task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Create_New_Content_Test extends TestCase {

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Create_New_Content
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

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Create_New_Content( $this->post_type_helper );
	}
}
