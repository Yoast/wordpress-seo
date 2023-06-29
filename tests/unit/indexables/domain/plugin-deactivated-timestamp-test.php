<?php


namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Yoast\WP\SEO\Indexables\Domain\Plugin_Deactivated_Timestamp;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Plugin_Deactivated_Timestamp_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Domain\Plugin_Deactivated_Timestamp
 */
class Plugin_Deactivated_Timestamp_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Plugin_Deactivated_Timestamp
	 */
	private $instance;

	/**
	 * Tests constructor function.
	 *
	 * @covers ::__construct
	 * @return void
	 */
	public function test_constructor() {
		$this->instance = new Plugin_Deactivated_Timestamp( \time() );
	}
}
