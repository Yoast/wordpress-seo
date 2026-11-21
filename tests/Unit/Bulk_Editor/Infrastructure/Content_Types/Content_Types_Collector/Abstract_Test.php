<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Type_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Content_Types_Collector tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Test extends TestCase {

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
	 * Holds the content type access checker.
	 *
	 * @var Mockery\MockInterface|Content_Type_Access_Checker_Interface
	 */
	protected $access_checker;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->access_checker   = Mockery::mock( Content_Type_Access_Checker_Interface::class );

		$this->instance = new Content_Types_Collector( $this->post_type_helper, $this->access_checker );
	}
}
