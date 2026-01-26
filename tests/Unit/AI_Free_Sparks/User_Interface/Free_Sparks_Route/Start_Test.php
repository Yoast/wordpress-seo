<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

use Mockery;
use WP_REST_Response;

/**
 * Tests the Free_Sparks_Route's start method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route::start
 */
final class Start_Test extends Abstract_Free_Sparks_Route_Test {

	/**
	 * Tests start method when successful.
	 *
	 * @return void
	 */
	public function test_start_success() {
		$this->free_sparks_handler->expects( 'start' )
			->once()
			->with( null )
			->andReturn( true );

		mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->start();
		$this->assertInstanceOf( WP_REST_Response::class, $result );
		$this->assertEquals( new WP_REST_Response( 'Free sparks successfully started.' ), $result );
	}

	/**
	 * Tests start when fails.
	 *
	 * @return void
	 */
	public function test_start_fail() {
		$this->free_sparks_handler->expects( 'start' )
			->once()
			->with( null )
			->andReturn( false );

		mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->start();
		$this->assertInstanceOf( WP_REST_Response::class, $result );
		$this->assertEquals( new WP_REST_Response( 'Failed to start free sparks.', 500 ), $result );
	}
}
