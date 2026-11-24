<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Logo_Meta_Watcher tests.
 *
 * @group integrations
 * @group watchers
 */
abstract class Abstract_Logo_Meta_Watcher_Test extends TestCase {

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image_helper;

	/**
	 * The instance to test.
	 *
	 * @var Logo_Meta_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image_helper = Mockery::mock( Image_Helper::class );

		$this->instance = new Logo_Meta_Watcher( $this->image_helper );
	}
}
