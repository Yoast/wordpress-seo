<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\Free_Sparks\Application\Free_Sparks_Handler;

use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler;

/**
 * Tests the Free_Sparks_Handler' get method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::get
 */
final class Get_Test extends Abstract_Free_Sparks_Handler_Test {

	/**
	 * Tests get method.
	 *
	 * @dataProvider get_provider
	 *
	 * @param ?int    $timestamp The timestamp that the options helper will return.
	 * @param ?string $expected  The expected return value from the get method.
	 * @param string  $message   Optional. A message to display on failure.
	 *
	 * @return void
	 */
	public function test_get( ?int $timestamp, ?string $expected, string $message = '' ): void {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( Free_Sparks_Handler::OPTION_KEY, null )
			->andReturn( $timestamp );

		$this->assertSame( $expected, $this->instance->get(), $message );
	}

	/**
	 * Data provider for test_get.
	 *
	 * @return array<array<string, int|string|null>>
	 */
	public function get_provider() {
		return [
			[
				'timestamp' => null,
				'expected'  => null,
			],
			[
				'timestamp' => \strtotime( 'June 5th 2025, 15 hours, 26 mins, 44 secs' ),
				'expected'  => '2025-06-05 15:26:44',
			],
		];
	}
}
