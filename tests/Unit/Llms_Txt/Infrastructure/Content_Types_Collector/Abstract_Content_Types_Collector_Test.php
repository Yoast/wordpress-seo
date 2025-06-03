<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Content_Types_Collector;

use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Content_Types_Collector tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Content_Types_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Types_Collector
	 */
	protected $instance;

	/**
	 * Holds the post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Content_Types_Collector(
			$this->post_type_helper
		);
	}
}
