<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application\Commands;

use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verify_Non_Timestamp_Indexables_Command_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command
 */
final class Verify_Non_Timestamp_Indexables_Command_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Verify_Non_Timestamp_Indexables_Command
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Verify_Non_Timestamp_Indexables_Command( 10, 10, 'post' );
	}

	/**
	 * Tests the get current action object.
	 *
	 * @covers ::get_current_action
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_get_current_action() {
		$this->assertEquals( new Current_Verification_Action( 'post' ), $this->instance->get_current_action() );
	}

	/**
	 * Tests the last batch count object.
	 *
	 * @covers ::get_last_batch_count
	 *
	 * @return void
	 */
	public function test_get_last_batch_count() {
		$this->assertEquals( new Last_Batch_Count( 10 ), $this->instance->get_last_batch_count() );
	}

	/**
	 * Test getting the batch size object.
	 *
	 * @covers ::get_batch_size
	 * @return void
	 */
	public function test_get_batch_size() {
		$this->assertEquals( new Batch_Size( 10 ), $this->instance->get_batch_size() );
	}
}
