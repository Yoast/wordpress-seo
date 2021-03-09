<?php

namespace Yoast\WP\SEO\Tests\Unit\Models\Settings;

use Exception;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Search_Engine_Verify_Settings_Test.
 *
 * @group models
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings
 */
class Search_Engine_Verify_Settings_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Search_Engine_Verify_Settings
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Search_Engine_Verify_Settings();
	}

	/**
	 * Test that the settings for the model are set up correctly
	 *
	 * @covers ::get_settings
	 */
	public function test_get_settings() {
		$expected_configuration = [
			'baiduverify' => [
				'default' => '',
			],
			'googleverify' => [
				'default' => '',
			],
			'msverify' => [
				'default' => '',
			],
			'yandexverify' => [
				'default' => '',
			],
		];

		self::assertSame( $expected_configuration, $this->instance->get_settings() );
	}
}
