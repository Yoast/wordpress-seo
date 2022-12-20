<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Indexables_Page_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Admin\Old_Premium_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Old_Premium_Integration_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Old_Premium_Integration
 */
class Old_Premium_Integration_Test extends TestCase {

	/**
	 * Mock of the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Mock of the product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * Mock of the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Mock of the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Mock of the instance.
	 *
	 * @var Mockery\MockInterface|Old_Premium_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->options_helper    = Mockery::mock( Options_Helper::class );
		$this->product_helper    = Mockery::mock( Product_Helper::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->asset_manager     = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->instance          = new Old_Premium_Integration(
			$this->options_helper,
			$this->product_helper,
			$this->capability_helper,
			$this->asset_manager
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);

		self::assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);

		self::assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);

		self::assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'admin_asset_manager' )
		);
	}

	/**
	 * Tests if the expected conditionals are given.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class ], Old_Premium_Integration::get_conditionals() );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'old_premium_notice' ] ) );
		$this->assertNotFalse( \has_action( 'wp_ajax_dismiss_old_premium_notice', [ $this->instance, 'dismiss_old_premium_notice' ] ) );
	}

	/**
	 * Tests showing the notice when all the conditions are true.
	 *
	 * @covers ::old_premium_notice
	 * @covers ::premium_is_old
	 */
	public function test_old_premium_notice() {
		$this->options_helper
			->expects( 'get' )
			->with( 'dismiss_old_premium_notice', false )
			->andReturnFalse();

		$this->capability_helper
			->expects( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturnTrue();

		$this->product_helper
			->expects( 'get_premium_version' )
			->andReturn( '19.7' );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'monorepo' );

		Monkey\Functions\expect( 'wp_enqueue_style' )->with( 'yoast-seo-notifications' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( 'https://example.org/wp-content/plugins/' );

		$conditional = Mockery::mock( Indexables_Page_Conditional::class );
		$conditional->expects( 'is_met' )->once()->andReturnFalse();

		$container = $this->create_container_with( [ Indexables_Page_Conditional::class => $conditional ] );

		Monkey\Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'classes' => $this->create_classes_surface( $container ) ] );

		// Output should contain the ajax action script.
		$this->expectOutputContains(
			"<script>
                function dismiss_old_premium_notice(){
                    var data = {
                    'action': 'dismiss_old_premium_notice',
                    };

                    jQuery.post( ajaxurl, data, function( response ) {
                        jQuery( '#yoast-old-premium-notice' ).hide();
                    });
                }

                jQuery( document ).ready( function() {
                    jQuery( 'body' ).on( 'click', '#yoast-old-premium-notice .notice-dismiss', function() {
                        dismiss_old_premium_notice();
                    } );
                } );
            </script>"
		);

		$this->instance->old_premium_notice();
	}

	/**
	 * Tests showing the notice when we're on the wrong page.
	 *
	 * @covers ::old_premium_notice
	 */
	public function test_old_premium_notice_if_on_update_page() {
		global $pagenow;
		$pagenow = 'update.php';

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->old_premium_notice();
	}

	/**
	 * Tests showing the notice when the notice has been dismissed.
	 *
	 * @covers ::old_premium_notice
	 */
	public function test_old_premium_notice_if_dismissed() {
		global $pagenow;
		$pagenow = 'admin.php';

		$this->options_helper
			->expects( 'get' )
			->with( 'dismiss_old_premium_notice', false )
			->andReturnTrue();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->old_premium_notice();
	}

	/**
	 * Tests showing the notice when the user doesn't have the right capability.
	 *
	 * @covers ::old_premium_notice
	 */
	public function test_old_premium_notice_if_no_capabilities() {
		global $pagenow;
		$pagenow = 'admin.php';

		$this->options_helper
			->expects( 'get' )
			->with( 'dismiss_old_premium_notice', false )
			->andReturnFalse();

		$this->capability_helper
			->expects( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturnFalse();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->old_premium_notice();
	}

	/**
	 * Tests showing the notice when Premium is not active.
	 *
	 * @covers ::old_premium_notice
	 * @covers ::premium_is_old
	 */
	public function test_old_premium_notice_if_no_premium_active() {
		global $pagenow;
		$pagenow = 'admin.php';

		$this->options_helper
			->expects( 'get' )
			->with( 'dismiss_old_premium_notice', false )
			->andReturnFalse();

		$this->capability_helper
			->expects( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturnTrue();

		$this->product_helper
			->expects( 'get_premium_version' )
			->andReturnNull();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->old_premium_notice();
	}

	/**
	 * Tests dismissing the notice.
	 *
	 * @covers ::dismiss_old_premium_notice
	 */
	public function test_dismiss_premium_deactivated_notice() {
		$this->options_helper
			->expects( 'set' )
			->with( 'dismiss_old_premium_notice', true );

		$this->instance->dismiss_old_premium_notice();
	}
}
