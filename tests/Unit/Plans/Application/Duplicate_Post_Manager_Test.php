<?php


namespace Yoast\WP\SEO\Tests\Unit\Plans\Application;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Plans\Application\Duplicate_Post_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Duplicate Post Manager.
 *
 * @group plans
 *
 * @coversDefaultClass \Yoast\WP\SEO\Plans\Application\Duplicate_Post_Manager
 */
final class Duplicate_Post_Manager_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Duplicate_Post_Manager
	 */
	private $instance;

	/**
	 * Holds the WPSEO_Addon_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( WPSEO_Addon_Manager::class, $this->getPropertyValue( $this->instance, 'addon_manager' ) );
	}

	/**
	 * Tests get_params.
	 *
	 * @covers ::get_params
	 *
	 * @return void
	 */
	public function test_get_params() {
		$this->addon_manager->expects( 'get_plugins' )
			->once()
			->withNoArgs()
			->andReturn( [ Duplicate_Post_Manager::PLUGIN_FILE => [] ] );

		$this->addon_manager->expects( 'is_plugin_active' )
			->once()
			->with( Duplicate_Post_Manager::PLUGIN_FILE )
			->andReturn( false );

		$installation_url = 'https://example.com/wp-admin/update.php?action=install-plugin&plugin=duplicate-post&_wpnonce=8cfd3ae071';
		$activation_url   = 'https://example.com/wp-admin/plugins.php?action=activate&plugin_status=all&paged=1&s&plugin=duplicate-post%2Fduplicate-post.php&_wpnonce=2ada494acc';

		Functions\expect( 'html_entity_decode' )
			->twice()
			->withAnyArgs()
			->andReturnValues( [ $installation_url, $activation_url ] );

		Functions\expect( 'current_user_can' )
			->twice()
			->withAnyArgs()
			->andReturn( false );

		$expected = [
			'isInstalled'     => true,
			'isActivated'     => false,
			'installationUrl' => $installation_url,
			'activationUrl'   => $activation_url,
		];

		$this->assertSame( $expected, $this->instance->get_params() );
	}

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->instance = new Duplicate_Post_Manager( $this->addon_manager );
	}
}
