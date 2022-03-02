<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Yoast\WP\SEO\Services\Health_Check\Page_Comments_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Page_Comments_Runner_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Page_Comments_Runner
 */
class Page_Comments_Runner_Test extends TestCase {

	/**
	 * The Page_Comments_Runner instance to be tested.
	 *
	 * @var Page_Comments_Runner
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Page_Comments_Runner();
	}

	/**
	 * Checks if the health check succeeds when the comments are set to be on a single page.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_returns_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_comments' )
			->andReturn( '0' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertTrue( $actual );
	}

	/**
	 * Checks if the health check fails when the comments are set to be on multiple pages.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_retuns_not_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_comments' )
			->andReturn( '1' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertFalse( $actual );
	}
}
