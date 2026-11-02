<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Archives_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target
 */
final class Author_Archives_Target_Test extends TestCase {

	/**
	 * The author archive helper mock.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_Archives_Target
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->author_archive_helper = Mockery::mock( Author_Archive_Helper::class );

		$this->instance = new Author_Archives_Target( $this->author_archive_helper );
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
	 * Tests that is_enabled reflects whether the author archives are disabled.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_is_enabled
	 *
	 * @param bool $disabled Whether the author archives are disabled.
	 * @param bool $expected Whether the author archives are expected to be enabled.
	 *
	 * @return void
	 */
	public function test_is_enabled( $disabled, $expected ) {
		$this->author_archive_helper->expects( 'are_disabled' )->once()->andReturn( $disabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}
}
