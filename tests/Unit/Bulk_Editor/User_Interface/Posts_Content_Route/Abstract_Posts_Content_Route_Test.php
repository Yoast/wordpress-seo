<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Content_Route;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Content_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Posts_Content_Route tests.
 *
 * @group bulk-editor
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Posts_Content_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_Content_Route
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

		$this->instance = new Posts_Content_Route( $this->post_access_checker );
	}

	/**
	 * Allows a post through every access check.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	protected function allow_post( int $post_id ) {
		$this->post_access_checker->expects( 'exists' )->once()->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'is_supported_type' )->once()->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'can_edit' )->once()->with( $post_id )->andReturnTrue();
	}
}
