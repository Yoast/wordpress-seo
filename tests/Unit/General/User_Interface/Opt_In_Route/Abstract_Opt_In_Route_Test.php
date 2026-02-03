<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface\Opt_In_Route;

use Mockery;
use Yoast\WP\SEO\General\User_Interface\Opt_In_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Opt_In_Route tests.
 *
 * @group opt-in-route
 */
abstract class Abstract_Opt_In_Route_Test extends TestCase {

	/**
	 * Holds the user helper.
	 *
	 * @var  Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var  Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * The instance to test.
	 *
	 * @var Opt_In_Route
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->user_helper       = Mockery::mock( User_Helper::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );

		$this->instance = new Opt_In_Route( $this->user_helper, $this->capability_helper );
	}
}
