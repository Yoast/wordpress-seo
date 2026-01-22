<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\Application\Free_Sparks_Handler;

use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Handler;

/**
 * Tests the Free_Sparks_Handler' start method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Handler::start
 */
final class Start_Test extends Abstract_Free_Sparks_Handler_Test {

	/**
	 * Tests start now (no timestamp given).
	 *
	 * @return void
	 */
	public function test_start_now() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( Free_Sparks_Handler::OPTION_KEY, \time(), 'wpseo' );

		$this->instance->start();
	}

	/**
	 * Tests start calling the options helper.
	 *
	 * @return void
	 */
	public function test_start_with_timestamp() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( Free_Sparks_Handler::OPTION_KEY, 1234, 'wpseo' );

		$this->instance->start( 1234 );
	}
}
