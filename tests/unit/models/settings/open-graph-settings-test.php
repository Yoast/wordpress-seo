<?php

namespace Yoast\WP\SEO\Tests\Unit\Models\Settings;

use Mockery;
use Yoast\WP\SEO\Models\Settings\Open_Graph_Settings;
use Yoast\WP\SEO\Repositories\Settings_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Open_Graph_Settings_Test.
 *
 * @group models
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Settings\Open_Graph_Settings
 */
class Open_Graph_Settings_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Open_Graph_Settings
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

		$this->settings_repository = Mockery::mock( Settings_Repository::class )->makePartial();
		$this->instance            = new Open_Graph_Settings( $this->settings_repository );
	}

	/**
	 * Test that the settings for the model are set up correctly
	 *
	 * @covers ::get_settings
	 */
	public function test_get_settings() {
		$expected_configuration = [
			'opengraph'             => [
				'default' => true,
			],
			'og_default_image'      => [
				'default' => '',
			],
			'og_default_image_id'   => [
				'default' => '',
			],
			'og_frontpage_title'    => [
				'default' => '',
			],
			'og_frontpage_desc'     => [
				'default' => '',
			],
			'og_frontpage_image'    => [
				'default' => '',
			],
			'og_frontpage_image_id' => [
				'default' => '',
			],
		];

		self::assertSame( $expected_configuration, $this->instance->get_settings() );
	}
}
