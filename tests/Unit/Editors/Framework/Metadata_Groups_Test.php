<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Mockery;
use Yoast\WP\SEO\Editors\Framework\Metadata_Groups;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Metadata_Groups_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Metadata_Groups
 */
final class Metadata_Groups_Test extends TestCase {

		/**
		 * Holds the Options_Helper mock instance.
		 *
		 * @var Mockery\MockInterface|Options_Helper
		 */
		private $options_helper;

		/**
		 * Holds the Capability_Helper mock instance.
		 *
		 * @var Mockery\MockInterface|Capability_Helper
		 */
		private $capability_helper;

		/**
		 * The Metadata_Groups.
		 *
		 * @var Metadata_Groups
		 */
		private $instance;

		/**
		 * Set up the test.
		 *
		 * @return void
		 */
	protected function set_up(): void {
		parent::set_up();
		$this->options_helper    = Mockery::mock( Options_Helper::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
	}

		/**
		 * Data provider for test_get_post_metadata_groups.
		 *
		 * @return array<array<string|bool>>
		 */
	public static function data_provider_get_post_metadata_groups(): array {
		return [
			'opengraph_enabled'  => [
				'opengraph_enabled' => true,
				'twitter_enabled'   => false,
				'advanced_enabled'  => false,
				'user_can_edit'     => false,
				'expected'          => [ 'general', 'schema', 'advanced', 'social' ],
			],
			'opengraph_disabled' => [
				'opengraph_enabled' => false,
				'twitter_enabled'   => false,
				'advanced_enabled'  => false,
				'user_can_edit'     => false,
				'expected'          => [ 'general', 'schema', 'advanced' ],
			],
			'twitter_enabled'    => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => true,
				'advanced_enabled'      => false,
				'user_can_edit'         => false,
				'expected'              => [ 'general', 'schema', 'advanced', 'social' ],
			],
			'twitter_disabled'   => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => false,
				'user_can_edit'         => true,
				'expected'              => [ 'general', 'schema', 'advanced' ],
			],
			'advanced_disabled'  => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => true,
				'user_can_edit'         => false,
				'expected'              => [ 'general', 'schema' ],
			],
			'user_cannot_edit'   => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => true,
				'user_can_edit'         => true,
				'expected'              => [ 'general', 'schema', 'advanced' ],
			],
		];
	}

		/**
		 * Tests the get_post_metadata_groups method.
		 *
		 * @covers ::get_post_metadata_groups
		 * @covers ::is_advanced_enabled
		 * @covers ::is_social_enabled
		 *
		 * @dataProvider data_provider_get_post_metadata_groups
		 *
		 * @param bool          $opengraph_enabled Whether opengraph is enabled.
		 * @param bool          $twitter_enabled   Whether twitter is enabled.
		 * @param bool          $advanced_enabled  Whether advanced is enabled.
		 * @param bool          $user_can_edit     Whether the user can edit.
		 * @param array<string> $expected          The expected result.
		 * @return void
		 */
	public function test_get_post_metadata_groups( $opengraph_enabled, $twitter_enabled, $advanced_enabled, $user_can_edit, $expected ): void {

		$this->options_helper->expects( 'get' )
			->with( 'opengraph', false )
			->andReturn( $opengraph_enabled );

		$twitter_times = ( $opengraph_enabled ) ? 0 : 1;

		$this->options_helper->expects( 'get' )
			->with( 'twitter', false )
			->times( $twitter_times )
			->andReturn( $twitter_enabled );

		$this->capability_helper->expects( 'current_user_can' )
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $user_can_edit );

		$advanced_enabled_times = ( $user_can_edit ) ? 0 : 1;

		$this->options_helper->expects( 'get' )
			->with( 'disableadvanced_meta' )
			->times( $advanced_enabled_times )
			->andReturn( $advanced_enabled );

		$instance = new Metadata_Groups( $this->options_helper, $this->capability_helper );

		$this->assertSame( $expected, $instance->get_post_metadata_groups() );
	}

	/**
	 * Data provider for test_get_term_metadata_groups.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_get_term_metadata_groups() {
		return [
			'opengraph_enabled'  => [
				'opengraph_enabled' => true,
				'twitter_enabled'   => false,
				'advanced_enabled'  => false,
				'user_can_edit'     => false,
				'expected'          => [ 'content', 'settings', 'social' ],
			],
			'opengraph_disabled' => [
				'opengraph_enabled' => false,
				'twitter_enabled'   => false,
				'advanced_enabled'  => false,
				'user_can_edit'     => false,
				'expected'          => [ 'content', 'settings' ],
			],
			'twitter_enabled'    => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => true,
				'advanced_enabled'      => false,
				'user_can_edit'         => false,
				'expected'              => [ 'content', 'settings', 'social' ],
			],
			'twitter_disabled'   => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => false,
				'user_can_edit'         => true,
				'expected'              => [ 'content', 'settings' ],
			],
			'advanced_disabled'  => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => true,
				'user_can_edit'         => false,
				'expected'              => [ 'content' ],
			],
			'user_cannot_edit'   => [
				'opengraph_enabled'     => false,
				'twitter_enabled'       => false,
				'advanced_enabled'      => true,
				'user_can_edit'         => true,
				'expected'              => [ 'content', 'settings' ],
			],
		];
	}

	/**
	 * Tests the get_term_metadata_groups method.
	 *
	 * @covers ::get_term_metadata_groups
	 * @covers ::is_advanced_enabled
	 * @covers ::is_social_enabled
	 *
	 * @dataProvider data_provider_get_term_metadata_groups
	 *
	 * @param bool          $opengraph_enabled Whether opengraph is enabled.
	 * @param bool          $twitter_enabled   Whether twitter is enabled.
	 * @param bool          $advanced_enabled  Whether advanced is enabled.
	 * @param bool          $user_can_edit     Whether the user can edit.
	 * @param array<string> $expected          The expected result.
	 * @return void
	 */
	public function test_get_term_metadata_groups( $opengraph_enabled, $twitter_enabled, $advanced_enabled, $user_can_edit, $expected ) {
		$this->options_helper->expects( 'get' )
			->with( 'opengraph', false )
			->andReturn( $opengraph_enabled );

		$twitter_times = ( $opengraph_enabled ) ? 0 : 1;

		$this->options_helper->expects( 'get' )
			->with( 'twitter', false )
			->times( $twitter_times )
			->andReturn( $twitter_enabled );

		$this->capability_helper->expects( 'current_user_can' )
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $user_can_edit );

		$advanced_enabled_times = ( $user_can_edit ) ? 0 : 1;

		$this->options_helper->expects( 'get' )
			->with( 'disableadvanced_meta' )
			->times( $advanced_enabled_times )
			->andReturn( $advanced_enabled );

		$instance = new Metadata_Groups( $this->options_helper, $this->capability_helper );

		$this->assertSame( $expected, $instance->get_term_metadata_groups() );
	}
}
