<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Route;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Repository;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Posts_Route tests.
 *
 * @group bulk-editor
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Posts_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_Route
	 */
	protected $instance;

	/**
	 * Holds the posts repository.
	 *
	 * @var Mockery\MockInterface|Posts_Repository
	 */
	protected $posts_repository;

	/**
	 * Holds the content types repository.
	 *
	 * @var Mockery\MockInterface|Content_Types_Repository
	 */
	protected $content_types_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->posts_repository         = Mockery::mock( Posts_Repository::class );
		$this->content_types_repository = Mockery::mock( Content_Types_Repository::class );

		$this->instance = new Posts_Route( $this->posts_repository, $this->content_types_repository );
	}
}
