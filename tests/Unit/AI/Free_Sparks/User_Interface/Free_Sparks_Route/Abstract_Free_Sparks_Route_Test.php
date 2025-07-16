<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\Free_Sparks\User_Interface\Free_Sparks_Route;

use Mockery;
use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler_Interface;
use Yoast\WP\SEO\AI\Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Free_Sparks_Route tests.
 *
 * @group ai-free-sparks
 */
abstract class Abstract_Free_Sparks_Route_Test extends TestCase {

	/**
	 * The free sparks handler instance.
	 *
	 * @var Mockery\MockInterface|Free_Sparks_Handler_Interface
	 */
	protected $free_sparks_handler;

	/**
	 * The instance to test.
	 *
	 * @var Free_Sparks_Route
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->free_sparks_handler = Mockery::mock( Free_Sparks_Handler_Interface::class );

		$this->instance = new Free_Sparks_Route( $this->free_sparks_handler );
	}
}
