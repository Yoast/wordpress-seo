<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure\Tracking_On_Page_Load;

use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;
use Yoast\WP\SEO\Tracking\Infrastructure\Tracking_On_Page_Load_Integration;

/**
 * Abstract class for the Tracking_On_Page_Load_Integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group tracking
 */
abstract class Abstract_Tracking_On_Page_Load_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Tracking_On_Page_Load_Integration
	 */
	protected $instance;

	/**
	 * Holds the action tracker.
	 *
	 * @var Mockery\MockInterface|Action_Tracker
	 */
	protected $action_tracker;

	/**
	 * Holds the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

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
	protected function set_up() {
		parent::set_up();

		$this->action_tracker    = Mockery::mock( Action_Tracker::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->options_helper    = Mockery::mock( Options_Helper::class );

		$this->instance = new Tracking_On_Page_Load_Integration(
			$this->action_tracker,
			$this->capability_helper,
			$this->options_helper
		);
	}
}
