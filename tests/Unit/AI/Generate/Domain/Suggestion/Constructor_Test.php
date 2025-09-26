<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Domain\Suggestion;

use Yoast\WP\SEO\AI\Generate\Domain\Suggestion;

/**
 * Tests the Suggestion constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\Domain\Suggestion::__construct
 */
final class Constructor_Test extends Abstract_Suggestion_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Suggestion::class, $this->instance );
	}
}
