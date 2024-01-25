<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Current_Verification_Action_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action
 */
final class Current_Verification_Action_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Current_Verification_Action
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Current_Verification_Action( 'term' );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_action
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_action() {
		$this->assertSame( 'term', $this->instance->get_action() );
	}
}
