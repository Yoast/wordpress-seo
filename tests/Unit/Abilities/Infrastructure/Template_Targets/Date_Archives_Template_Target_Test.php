<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Brain\Monkey;
use Mockery;
use WP_Rewrite;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Date_Archives_Template_Target;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Date_Archives_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Date_Archives_Template_Target
 */
final class Date_Archives_Template_Target_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Date_Archives_Template_Target
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

		$this->instance = new Date_Archives_Template_Target( $this->options_helper );
	}

	/**
	 * Tears down the test fixtures.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset( $GLOBALS['wp_rewrite'] );

		parent::tear_down();
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

	/**
	 * Tests that get_url falls back to the query string pattern without pretty permalinks.
	 *
	 * @covers ::get_url
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Abstract_Template_Target::get_url_pattern
	 *
	 * @return void
	 */
	public function test_get_url_without_pretty_permalinks() {
		$wp_rewrite = Mockery::mock( WP_Rewrite::class );
		$wp_rewrite->expects( 'get_date_permastruct' )->once()->andReturnFalse();

		$GLOBALS['wp_rewrite'] = $wp_rewrite;

		Monkey\Functions\expect( 'home_url' )->once()->with( '/?m=%year%%monthnum%%day%' )->andReturn( 'https://example.com/?m=%year%%monthnum%%day%' );

		$this->assertSame( 'https://example.com/?m=%year%%monthnum%%day%', $this->instance->get_url() );
	}
}
