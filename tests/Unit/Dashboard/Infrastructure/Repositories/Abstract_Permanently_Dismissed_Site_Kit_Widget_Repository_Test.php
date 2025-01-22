<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories;

use Mockery;
use Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Permanently Dismissed Site Kit Widget Repository tests.
 *
 * @group Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Permanently_Dismissed_Site_Kit_Widget_Repository_Test extends TestCase
{
	/**
	 * Holds the instance.
	 *
	 * @var Permanently_Dismissed_Site_Kit_Widget_Repository
	 */
	protected $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up()
	{
		parent::set_up();

		$this->options_helper = Mockery::mock(Options_Helper::class);

		$this->instance = new Permanently_Dismissed_Site_Kit_Widget_Repository($this->options_helper);
	}
}
