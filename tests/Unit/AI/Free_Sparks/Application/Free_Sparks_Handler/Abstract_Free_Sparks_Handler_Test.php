<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Free_Sparks\Application\Free_Sparks_Handler;

use Mockery;
use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Free_Sparks_Handler tests.
 *
 * @group ai-free-sparks
 */
abstract class Abstract_Free_Sparks_Handler_Test extends TestCase {

	/**
	 * The options helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The instance to test.
	 *
	 * @var Free_Sparks_Handler
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Free_Sparks_Handler( $this->options_helper );
	}
}
