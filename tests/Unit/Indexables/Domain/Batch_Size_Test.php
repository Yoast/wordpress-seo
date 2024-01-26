<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Batch_Size_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Domain\Batch_Size
 */
final class Batch_Size_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Batch_Size
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Batch_Size( 10 );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_batch_size
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_batch_size() {
		$this->assertSame( 10, $this->instance->get_batch_size() );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::should_keep_going
	 * @covers ::__construct
	 * @return void
	 */
	public function test_should_keep_going() {
		$this->assertSame( true, $this->instance->should_keep_going( 12 ) );
		$this->assertSame( false, $this->instance->should_keep_going( 9 ) );
		$this->assertSame( true, $this->instance->should_keep_going( 10 ) );
	}
}
