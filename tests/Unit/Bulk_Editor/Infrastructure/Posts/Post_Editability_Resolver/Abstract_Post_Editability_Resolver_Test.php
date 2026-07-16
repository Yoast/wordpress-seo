<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Post_Editability_Resolver tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Post_Editability_Resolver_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Post_Editability_Resolver
	 */
	protected $instance;

	/**
	 * Holds the post access checker.
	 *
	 * @var Mockery\MockInterface|Post_Access_Checker_Interface
	 */
	protected $post_access_checker;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_access_checker = Mockery::mock( Post_Access_Checker_Interface::class );

		$this->instance = new Post_Editability_Resolver( $this->post_access_checker );
	}
}
