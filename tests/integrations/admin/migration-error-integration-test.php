<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Admin
 */

namespace Yoast\WP\SEO\Tests\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Integrations\Admin\Migration_Error_Integration;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Migration_Error_Integration_Test
 *
 * @group integrations
 * @group migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Migration_Error_Integration
 */
class Migration_Error_Integration_Test extends TestCase {

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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->migration_status = Mockery::mock( Migration_Status::class );
		$this->instance         = new Migration_Error_Integration( $this->migration_status );
	}

	/**
	 * Tests if the dependency is set right.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Migration_Status::class, 'migration_status', $this->instance );
	}

	/**
	 * Tests if the expected conditionals are given.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class ], Migration_Error_Integration::get_conditionals() );
	}

	/**
	 * Tests the registratation of the hooks with having no error set.
	 *
	 * @covers ::register_hooks
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
	 */
	public function test_register_hooks_with_error_set() {
		$this->migration_status
			->expects( 'get_error' )
			->with( 'free' )
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertTrue( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
	}

	/**
	 * Tests the rendering of the migration error.
	 *
	 * @covers ::render_migration_error
	 */
	public function test_render_migration_error() {
		$this->migration_status->expects( 'get_error' )
			->once()
			->with( 'free' )
			->andReturn( [ 'message' => 'test error' ] );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( 'https://yoa.st/3-6' );

		$expected  = '<div class="notice notice-error">';
		$expected .= '<p>Yoast SEO had problems creating the database tables needed to speed up your site.</p>';
		$expected .= '<p>Please read <a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">this help article</a> to find out how to resolve this problem.</p>';
		$expected .= '<p>Your site will continue to work normally, but won\'t take full advantage of Yoast SEO.</p>';
		$expected .= '<details><summary>Show debug information</summary><p>test error</p></details>';
		$expected .= '</div>';

		$this->instance->render_migration_error();

		$this->expectOutput( $expected );
	}
}
