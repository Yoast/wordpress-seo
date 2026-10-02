<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Logo_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Representation_Logo_Helper class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Logo_Helper
 */
final class Site_Representation_Logo_Helper_Test extends TestCase {

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	private $image_helper;

	/**
	 * The instance under test.
	 *
	 * @var Site_Representation_Logo_Helper
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image_helper = Mockery::mock( Image_Helper::class );

		$this->instance = new Site_Representation_Logo_Helper( $this->image_helper );
	}

	/**
	 * Tests that a cleared logo resolves to 0 without looking it up.
	 *
	 * @covers ::__construct
	 * @covers ::get_logo_id
	 *
	 * @return void
	 */
	public function test_get_logo_id_cleared() {
		$this->image_helper->expects( 'get_attachment_by_url' )->never();

		$this->assertSame( 0, $this->instance->get_logo_id( '' ) );
	}

	/**
	 * Tests that a logo URL resolves to its attachment ID as an integer, even when it is found as a string.
	 *
	 * @covers ::get_logo_id
	 *
	 * @return void
	 */
	public function test_get_logo_id() {
		$this->image_helper->expects( 'get_attachment_by_url' )->once()->with( 'https://example.com/logo.png' )->andReturn( '12' );

		$this->assertSame( 12, $this->instance->get_logo_id( 'https://example.com/logo.png' ) );
	}
}
