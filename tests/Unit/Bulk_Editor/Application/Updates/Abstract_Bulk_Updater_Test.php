<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Updates;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Search\Search_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Search\Search_Meta_Writer_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the bulk updater tests. The abstract updater is exercised
 * through the search bulk updater.
 */
abstract class Abstract_Bulk_Updater_Test extends TestCase {

	/**
	 * The post access checker.
	 *
	 * @var Mockery\MockInterface|Post_Access_Checker_Interface
	 */
	protected $post_access_checker;

	/**
	 * The meta writer.
	 *
	 * @var Mockery\MockInterface|Search_Meta_Writer_Interface
	 */
	protected $meta_writer;

	/**
	 * Holds the instance.
	 *
	 * @var Search_Bulk_Updater
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_access_checker = Mockery::mock( Post_Access_Checker_Interface::class );
		$this->meta_writer         = Mockery::mock( Search_Meta_Writer_Interface::class );

		$this->instance = new Search_Bulk_Updater( $this->post_access_checker, $this->meta_writer );
	}

	/**
	 * Lets the access checker report the given post as fully editable.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return void
	 */
	protected function expect_editable_post( int $post_id ): void {
		$this->post_access_checker->expects( 'exists' )->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'is_supported_type' )->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'can_edit' )->with( $post_id )->andReturnTrue();
	}
}
