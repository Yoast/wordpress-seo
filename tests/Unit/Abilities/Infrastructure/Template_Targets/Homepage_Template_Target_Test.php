<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Brain\Monkey;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Template_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Homepage_Template_Target;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Homepage_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Homepage_Template_Target
 */
final class Homepage_Template_Target_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Homepage_Template_Target
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

		$this->instance = new Homepage_Template_Target();
	}

	/**
	 * Mocks the homepage settings.
	 *
	 * @param string $show_on_front What the homepage shows.
	 * @param int    $page_on_front The ID of the static front page.
	 *
	 * @return void
	 */
	private function mock_homepage( string $show_on_front, int $page_on_front ): void {
		// The base test case already expects get_option, so it cannot be stubbed.
		Monkey\Functions\expect( 'get_option' )->andReturnUsing(
			static function ( $option ) use ( $show_on_front, $page_on_front ) {
				return ( $option === 'show_on_front' ) ? $show_on_front : $page_on_front;
			},
		);
	}

	/**
	 * Tests the name and sharing of the homepage.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_identity() {
		$this->assertSame( 'homepage', $this->instance->get_name() );
		$this->assertFalse( $this->instance->is_shared() );
	}

	/**
	 * Tests that the homepage is enabled and available when it shows the latest posts.
	 *
	 * @covers ::is_enabled
	 * @covers ::ensure_available
	 * @covers ::get_static_front_page_id
	 *
	 * @return void
	 */
	public function test_latest_posts() {
		$this->mock_homepage( 'posts', 0 );

		$this->instance->ensure_available();

		$this->assertTrue( $this->instance->is_enabled() );
	}

	/**
	 * Tests that a static homepage is disabled and points to its page.
	 *
	 * @covers ::is_enabled
	 * @covers ::ensure_available
	 * @covers ::get_static_front_page_id
	 *
	 * @return void
	 */
	public function test_static_homepage() {
		$this->mock_homepage( 'page', 42 );

		$this->assertFalse( $this->instance->is_enabled() );

		try {
			$this->instance->ensure_available();
			$this->fail( 'A static homepage should not be available.' );
		} catch ( Unavailable_Template_Target_Exception $exception ) {
			$this->assertSame( 'yoast_seo_static_homepage', $exception->get_error_code() );
			$this->assertStringContainsString( 'ID 42', $exception->getMessage() );
		}
	}
}
