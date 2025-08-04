<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Endpoint\Endpoint_List;

use Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_List;

/**
 * Tests the Endpoint_List constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_List::__construct
 */
final class Constructor_Test extends Abstract_Endpoint_List_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Endpoint_List::class, $this->instance );
	}
}
