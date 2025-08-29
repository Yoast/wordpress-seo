<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Bust_Subscription_Cache_Route tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Bust_Subscription_Cache_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Bust_Subscription_Cache_Route
	 */
	protected $instance;

	/**
	 * Represents the add-on manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->instance = new Bust_Subscription_Cache_Route( $this->addon_manager );
	}
}
