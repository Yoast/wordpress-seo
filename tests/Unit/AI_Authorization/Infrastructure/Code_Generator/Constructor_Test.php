<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Generator;

use Yoast\WP\SEO\AI_Authorization\Application\Code_Generator_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Generator;

/**
 * Tests the Code_Generator constructor.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Generator::__construct
 */
final class Constructor_Test extends Abstract_Code_Generator_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Code_Generator::class, $this->instance );
		$this->assertInstanceOf( Code_Generator_Interface::class, $this->instance );
	}
}
