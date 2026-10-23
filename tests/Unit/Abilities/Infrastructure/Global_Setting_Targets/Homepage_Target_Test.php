<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Homepage_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target
 */
final class Homepage_Target_Test extends TestCase {

	/**
	 * The current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * The instance under test.
	 *
	 * @var Homepage_Target
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new Homepage_Target( $this->current_page_helper );
	}

	/**
	 * Tests the name and sharing of the homepage.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_identity() {
		$this->assertSame( 'homepage', $this->instance->get_name() );
		$this->assertFalse( $this->instance->is_shared() );
	}

	/**
	 * Tests that the homepage is available when it shows the latest posts.
	 *
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_latest_posts() {
		$this->current_page_helper->expects( 'get_front_page_id' )->once()->andReturn( 0 );

		$this->instance->ensure_available();

		$this->assertTrue( $this->instance->is_enabled() );
	}

	/**
	 * Tests that a static homepage is not available and points to its page.
	 *
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_static_homepage() {
		$this->current_page_helper->expects( 'get_front_page_id' )->once()->andReturn( 42 );

		try {
			$this->instance->ensure_available();
			$this->fail( 'A static homepage should not be available.' );
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			$this->assertSame( 'yoast_seo_static_homepage', $exception->get_error_code() );
			$this->assertStringContainsString( 'ID 42', $exception->getMessage() );
		}
	}
}
