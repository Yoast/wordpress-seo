<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Date_Archives_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target
 */
final class Date_Archives_Target_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Date_Archives_Target
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Date_Archives_Target( $this->options_helper );
	}

	/**
	 * Tests the name and sharing of the date archives.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::is_shared
	 *
	 * @return void
	 */
	public function test_identity() {
		$this->assertSame( 'date_archives', $this->instance->get_name() );
		$this->assertTrue( $this->instance->is_shared() );
	}

	/**
	 * Tests that is_enabled reflects the option that disables the date archives.
	 *
	 * @covers ::is_enabled
	 *
	 * @return void
	 */
	public function test_is_enabled() {
		$this->options_helper->expects( 'get' )->once()->with( 'disable-date', false )->andReturnTrue();

		$this->assertFalse( $this->instance->is_enabled() );
	}
}
