<?php

namespace Yoast\WP\SEO\Tests\Unit\Models\Settings;

use Mockery;
use Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Search_Engine_Verify_Settings_Test.
 *
 * @group models
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 5 words is fine.
 */
class Search_Engine_Verify_Settings_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Search_Engine_Verify_Settings
	 */
	protected $instance;

	/**
	 * Represents the settings repository.
	 *
	 * @var Mockery\MockInterface|Settings_Repository
	 */
	protected $settings_repository;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->settings_repository = Mockery::mock( Settings_Repository::class );
		$this->instance            = new Search_Engine_Verify_Settings( $this->settings_repository );
	}

	/**
	 * Test that the settings for the model are set up correctly
	 *
	 * @covers ::get_settings
	 */
	public function test_get_settings() {
		$expected_configuration = [
			'baiduverify'  => [
				'default' => '',
			],
			'googleverify' => [
				'default' => '',
			],
			'msverify'     => [
				'default' => '',
			],
			'yandexverify' => [
				'default' => '',
			],
		];

		self::assertSame( $expected_configuration, $this->instance->get_settings() );
	}
}
