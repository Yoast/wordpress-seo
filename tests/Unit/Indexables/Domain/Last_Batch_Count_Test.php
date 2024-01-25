<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Last_Batch_Count_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count
 */
final class Last_Batch_Count_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Last_Batch_Count
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Last_Batch_Count( 10 );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_last_batch
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_batch_size() {
		$this->assertSame( 10, $this->instance->get_last_batch() );
	}
}
