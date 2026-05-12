<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

use Mockery;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Banner_Permanent_Dismissal_Route tests.
 *
 * @group ai-content-planner
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Banner_Permanent_Dismissal_Route_Test extends TestCase {

	/**
	 * Holds the user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Holds the instance under test.
	 *
	 * @var Banner_Permanent_Dismissal_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Banner_Permanent_Dismissal_Route( $this->user_helper );
	}
}
