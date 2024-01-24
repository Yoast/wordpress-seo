<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Mockery;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Abstract_Presenter
 *
 * @group presenters
 */
final class Abstract_Presenter_Test extends TestCase {

	/**
	 * Tests the outputting of the value.
	 *
	 * @covers ::__toString
	 *
	 * @return void
	 */
	public function test_to_string() {
		$instance = Mockery::mock( Abstract_Presenter::class )->makePartial();
		$instance
			->expects( 'present' )
			->once()
			->andReturn( 'the value to present' );

		$this->assertSame( 'the value to present', (string) $instance );
	}
}
