<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
class Migration_Error_Integration_Test extends TestCase {

	/**
	 * Represents the migration status class.
	 *
	 * @var Mockery\MockInterface|Migration_Status
	 */
	protected $migration_status;

	/**
	 * Represents the options helper class.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Migration_Error_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->migration_status = Mockery::mock( Migration_Status::class );
		$this->options_helper   = Mockery::mock( Options_Helper::class );
		$this->instance         = new Migration_Error_Integration(
			$this->migration_status,
			$this->options_helper
		);
	}

	/**
	 * Tests if the dependency is set right.
	 *
	 * @covers ::__construct
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

		$this->options_helper
			->expects( 'get' )
			->with( 'ignore_migration_error_notice', false )
			->andReturnFalse();

		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
	}

	/**
	 * Tests the registratation of the hooks with the notice being dismissed.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_with_notice_dismissed() {
		$this->migration_status
			->expects( 'get_error' )
			->with( 'free' )
			->andReturnTrue();

		$this->options_helper
			->expects( 'get' )
			->with( 'ignore_migration_error_notice', false )
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertFalse( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
	}

	/**
	 * Tests the registratation of the hooks with the GET param set.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_with_get_param_set() {
		$this->migration_status
			->expects( 'get_error' )
			->with( 'free' )
			->andReturnTrue();

		$this->options_helper
			->expects( 'get' )
			->with( 'ignore_migration_error_notice', false )
			->andReturnTrue();

		$_GET['show_yoast_migration_errors'] = '1';

		$this->instance->register_hooks();

		unset( $_GET['show_yoast_migration_errors'] );

		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'render_migration_error' ] ) );
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

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->twice()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->twice()->andReturn( (object) [ 'helpers' => $helpers_mock ] );
		Monkey\Functions\expect( 'wp_create_nonce' )->andReturn( 'nonce' );

		$expected  = '<div id="migration-error-notice" class="notice notice-error">';
		$expected .= '<p>Yoast SEO had problems creating the database tables needed to speed up your site.</p>';
		$expected .= '<p>Please read <a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">this help article</a> to find out how to resolve this problem.</p>';
		$expected .= '<p>Your site will continue to work normally, but won\'t take full advantage of Yoast SEO.</p>';
		$expected .= '<details><summary>Show debug information</summary><p>test error</p></details>';
		$expected .= '<p><button type="button" class="button-link hide-if-no-js" data-nonce="nonce">Do not show me this notice again.</button></p>';
		$expected .= '</div>';

		$this->instance->render_migration_error();

		$this->expectOutputString( $expected );
	}
}
