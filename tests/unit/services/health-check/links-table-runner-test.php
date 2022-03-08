<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Health_Check\Links_Table_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Links_Table_Runner_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Links_Table_Runner
 */
class Links_Table_Runner_Test extends TestCase {

	/**
	 * The Links_Table_Runner instance to be tested.
	 *
	 * @var Links_Table_Runner
	 */
	private $instance;

	/**
	 * A mocked Migration_Status object.
	 *
	 * @var Migration_Status
	 */
	private $migration_status;

	/**
	 * A mocked WPSEO_Options object.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->migration_status = Mockery::mock( Migration_Status::class );
		$this->options          = Mockery::mock( Options_Helper::class );

		$this->instance = new Links_Table_Runner( $this->migration_status, $this->options );
	}

	/**
	 * Checks if the health check exits early when its preconditions aren't met.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::should_run
	 */
	public function test_early_exit() {
		$this->options
			->shouldReceive( 'get' )
			->with( 'enable_text_link_counter' )
			->andReturn( false );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertFalse( $actual );
	}

	/**
	 * Checks if the health check succeeds when the links table is accessible.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 * @covers ::should_run
	 */
	public function test_returns_successful() {
		$this->options
			->shouldReceive( 'get' )
			->with( 'enable_text_link_counter' )
			->andReturn( true );
		$this->migration_status
			->shouldReceive( 'is_version' )
			->withArgs( [ 'free', WPSEO_VERSION ] )
			->andReturn( true );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertTrue( $actual );
	}

	/**
	 * Checks if the health check fails when the links table is not accessible.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 * @covers ::should_run
	 */
	public function test_retuns_not_successful() {
		$this->options
			->shouldReceive( 'get' )
			->with( 'enable_text_link_counter' )
			->andReturn( true );
		$this->migration_status
			->shouldReceive( 'is_version' )
			->withArgs( [ 'free', WPSEO_VERSION ] )
			->andReturn( false );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertFalse( $actual );
	}
}
