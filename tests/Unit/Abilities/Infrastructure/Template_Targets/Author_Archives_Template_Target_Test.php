<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Author_Archives_Template_Target;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Archives_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Author_Archives_Template_Target
 */
final class Author_Archives_Template_Target_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_Archives_Template_Target
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

		$this->instance = new Author_Archives_Template_Target( $this->options_helper );
	}

	/**
	 * Tests the name and sharing of the author archives.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::is_shared
	 *
	 * @return void
	 */
	public function test_identity() {
		$this->assertSame( 'author_archives', $this->instance->get_name() );
		$this->assertTrue( $this->instance->is_shared() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<string, array<bool>>
	 */
	public static function data_is_enabled() {
		return [
			'Enabled'  => [ false, true ],
			'Disabled' => [ true, false ],
		];
	}

	/**
	 * Tests that is_enabled reflects the option that disables the author archives.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_is_enabled
	 *
	 * @param bool $disabled The value of the option that disables the author archives.
	 * @param bool $expected Whether the author archives are expected to be enabled.
	 *
	 * @return void
	 */
	public function test_is_enabled( $disabled, $expected ) {
		$this->options_helper->expects( 'get' )->once()->with( 'disable-author', false )->andReturn( $disabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}
}
