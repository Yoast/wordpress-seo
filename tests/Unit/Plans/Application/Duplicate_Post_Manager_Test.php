<?php

namespace Yoast\WP\SEO\Tests\Unit\Plans\Application;

use Brain\Monkey\Functions;
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
	 * Tests get_params.
	 *
	 * @covers ::get_params
	 *
	 * @return void
	 */
	public function test_get_params() {
		Functions\expect( 'is_plugin_active' )
			->once()
			->withAnyArgs()
			->andReturn( false );

		Functions\expect( 'file_exists' )
			->once()
			->withAnyArgs()
			->andReturn( true );

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

		$this->instance = new Duplicate_Post_Manager();
	}
}
