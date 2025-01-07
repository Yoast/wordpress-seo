<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Migration_Error_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Migration_Error_Integration_Test.
 *
 * @group integrations
 * @group migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Migration_Error_Integration
 */
final class Migration_Error_Integration_Test extends TestCase {

	/**
	 * Represents the migration status class.
	 *
	 * @var Mockery\MockInterface|Migration_Status
	 */
	protected $migration_status;

	/**
	 * Represents the instance to test.
	 *
	 * @var Migration_Error_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->migration_status = Mockery::mock( Migration_Status::class );
		$this->instance         = new Migration_Error_Integration( $this->migration_status );
	}

	/**
	 * Tests if the dependency is set right.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Migration_Status::class,
			$this->getPropertyValue( $this->instance, 'migration_status' )
		);
	}

	/**
	 * Tests if the expected conditionals are given.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class ], Migration_Error_Integration::get_conditionals() );
	}

	/**
	 * Tests the registratation of the hooks with having no error set.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_with_no_error_set() {
		$this->migration_status
			->expects( 'get_error' )
			->with( 'free' )
			->andReturnFalse();

		$this->instance->register_hooks();

		$this->assertFalse( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
	}

	/**
	 * Tests the registratation of the hooks with having no error set.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_with_error_set() {
		$this->migration_status
			->expects( 'get_error' )
			->with( 'free' )
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
	}

	/**
	 * Tests the rendering of the migration error.
	 *
	 * @covers ::render_migration_error
	 *
	 * @return void
	 */
	public function test_render_migration_error() {
		$this->migration_status->expects( 'get_error' )
			->once()
			->with( 'free' )
			->andReturn( [ 'message' => 'test error' ] );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( 'https://yoa.st/3-6' );

		$this->expect_shortlinker();

		$expected  = '<div class="notice notice-error yoast-migrated-notice">';
		$expected .= '<h4 class="yoast-notice-migrated-header">Yoast SEO is unable to create database tables</h4><div class="notice-yoast-content">';
		$expected .= '<p>Yoast SEO had problems creating the database tables needed to speed up your site.</p>';
		$expected .= '<p>Please read <a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">this help article</a> to find out how to resolve this problem.</p>';
		$expected .= '<p>Your site will continue to work normally, but won\'t take full advantage of Yoast SEO.</p>';
		$expected .= '<details><summary>Show debug information</summary><p>test error</p></details>';
		$expected .= '</div></div>';

		$this->instance->render_migration_error();

		$this->expectOutputString( $expected );
	}

	/**
	 * Holds expectations for the shortlinker.
	 *
	 * @return void
	 */
	private function expect_shortlinker() {
		$short_link_mock = Mockery::mock( Short_Link_Helper::class );

		// We're expecting it to be called twice because also the 'real' implementation in $instance will see the mocked surface.
		$short_link_mock->expects( 'get' )
			->twice()
			->andReturn( 'https://example.org?some=var' );

		$container = $this->create_container_with(
			[
				Short_Link_Helper::class => $short_link_mock,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->twice()
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );
	}
}
