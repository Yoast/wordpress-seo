<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Plugins_Tab\Application\Plugins_List_Handler;

/**
 * Tests the Plugins_List_Handler filter_plugins_list method.
 *
 * @group plugins-tab
 *
 * @covers Yoast\WP\SEO\Plugins_Tab\Application\Plugins_List_Handler::filter_plugins_list
 */
final class Filter_Plugins_List_Test extends Abstract_Plugins_List_Handler_Test {

	/**
	 * Tests that the yoast key is added when 2+ Yoast plugins are installed.
	 *
	 * @return void
	 */
	public function test_filter_plugins_list_with_multiple_yoast_plugins() {
		$yoast_free    = [ 'AuthorName' => 'Team Yoast' ];
		$yoast_premium = [ 'AuthorName' => 'Team Yoast' ];
		$other_plugin  = [ 'AuthorName' => 'Automattic' ];

		$plugins = [
			'all' => [
				'wordpress-seo/wp-seo.php'                 => $yoast_free,
				'wordpress-seo-premium/wp-seo-premium.php' => $yoast_premium,
				'jetpack/jetpack.php'                      => $other_plugin,
			],
		];

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $yoast_free )
			->andReturn( true );

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $yoast_premium )
			->andReturn( true );

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $other_plugin )
			->andReturn( false );

		$result = $this->instance->filter_plugins_list( $plugins );

		$this->assertArrayHasKey( 'yoast', $result );
		$this->assertCount( 2, $result['yoast'] );
		$this->assertArrayHasKey( 'wordpress-seo/wp-seo.php', $result['yoast'] );
		$this->assertArrayHasKey( 'wordpress-seo-premium/wp-seo-premium.php', $result['yoast'] );
	}

	/**
	 * Tests that the yoast key is not added when only 1 Yoast plugin is installed.
	 *
	 * @return void
	 */
	public function test_filter_plugins_list_with_single_yoast_plugin() {
		$yoast_free   = [ 'AuthorName' => 'Team Yoast' ];
		$other_plugin = [ 'AuthorName' => 'Automattic' ];

		$plugins = [
			'all' => [
				'wordpress-seo/wp-seo.php' => $yoast_free,
				'jetpack/jetpack.php'      => $other_plugin,
			],
		];

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $yoast_free )
			->andReturn( true );

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $other_plugin )
			->andReturn( false );

		$result = $this->instance->filter_plugins_list( $plugins );

		$this->assertArrayNotHasKey( 'yoast', $result );
	}

	/**
	 * Tests that the yoast key is not added when no Yoast plugins are installed.
	 *
	 * @return void
	 */
	public function test_filter_plugins_list_with_no_yoast_plugins() {
		$other_plugin = [ 'AuthorName' => 'Automattic' ];

		$plugins = [
			'all' => [
				'jetpack/jetpack.php' => $other_plugin,
			],
		];

		$this->detector
			->expects( 'is_yoast_plugin' )
			->with( $other_plugin )
			->andReturn( false );

		$result = $this->instance->filter_plugins_list( $plugins );

		$this->assertArrayNotHasKey( 'yoast', $result );
	}

	/**
	 * Tests that the plugins list is returned unchanged when 'all' key is missing.
	 *
	 * @return void
	 */
	public function test_filter_plugins_list_without_all_key() {
		$plugins = [
			'active' => [
				'jetpack/jetpack.php' => [ 'AuthorName' => 'Automattic' ],
			],
		];

		$result = $this->instance->filter_plugins_list( $plugins );

		$this->assertArrayNotHasKey( 'yoast', $result );
		$this->assertSame( $plugins, $result );
	}
}
