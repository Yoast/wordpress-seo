<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Runner;

/**
 * Default_Tagline_Runner_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Runner
 */
class Default_Tagline_Runner_Test extends TestCase {

	/**
	 * The Default_Tagline_Runner instance to be tested.
	 *
	 * @var Default_Tagline_Runner
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Default_Tagline_Runner();
	}

	/**
	 * Checks if the health check succeeds when something other than the default WordPress tagline is set.
	 *
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_returns_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'Something else' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertTrue( $actual );
	}

	/**
	 * Checks if the health check fails when the default WordPress tagline is set.
	 *
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_retuns_not_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'Just another WordPress site' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertFalse( $actual );
	}
}
