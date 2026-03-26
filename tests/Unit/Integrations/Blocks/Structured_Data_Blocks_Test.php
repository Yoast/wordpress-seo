<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Blocks;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Blocks\Structured_Data_Blocks;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Structure_Data_Blocks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Blocks\Structured_Data_Blocks
 *
 * @group integrations
 */
final class Structured_Data_Blocks_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Mockery\MockInterface|Structured_Data_Blocks
	 */
	protected $instance;

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The mocked image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image_helper;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->image_helper  = Mockery::mock( Image_Helper::class );

		$this->instance = new Structured_Data_Blocks(
			$this->asset_manager,
			$this->image_helper,
		);
	}

	/**
	 * Tests __construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Structured_Data_Blocks::class,
			new Structured_Data_Blocks(
				$this->asset_manager,
				$this->image_helper,
			),
		);
	}

	/**
	 * Data provider for the present_duration_text method.
	 *
	 * @return array[]
	 */
	public static function how_to_block_provider() {
		return [
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">The amount of time it will take:&nbsp;</span>2 hours and 20 minutes</p>',
				[
					'durationText'        => 'The amount of time it will take:',
					'defaultDurationText' => 'Time needed:',
					'hours'               => 2,
					'minutes'             => 20,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 hours and 20 minutes</p>',
				'A test case for when the non-default duration text is available',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>1 hour and 20 minutes</p>',
				[
					'defaultDurationText' => 'Time needed:',
					'hours'               => 1,
					'minutes'             => 20,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>1 hour and 20 minutes</p>',
				'A test case for when the non-default duration text is not available',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 days, 1 hour and 20 minutes</p>',
				[
					'defaultDurationText' => 'Time needed:',
					'days'                => 2,
					'hours'               => 1,
					'minutes'             => 20,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 days, 1 hour and 20 minutes</p>',
				'A test case for when the time units for days, hours and minutes are available',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>3 hours</p>',
				[
					'defaultDurationText' => 'Time needed:',
					'days'                => 0,
					'hours'               => 3,
					'minutes'             => 0,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>3 hours</p>',
				'A test case for when the time units are only available for hours',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>45 minutes</p>',
				[
					'defaultDurationText' => 'Time needed:',
					'days'                => 0,
					'hours'               => 0,
					'minutes'             => 45,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>45 minutes</p>',
				'A test case for when the time units are only available for minutes',
			],
			[
				'<p>The <b>Norwegian Forest cat</b> (Norwegian: <i lang="no"><b>Norsk skogskatt</b></i> and <b><span title="Norwegian-language text"><i lang="no">Norsk skaukatt</i></span></b>) is a breed of domestic cat originating in Northern Europe.',
				[
					'defaultDurationText' => 'Time needed:',
					'days'                => 0,
					'hours'               => 0,
					'minutes'             => 0,
				],
				'<p>The <b>Norwegian Forest cat</b> (Norwegian: <i lang="no"><b>Norsk skogskatt</b></i> and <b><span title="Norwegian-language text"><i lang="no">Norsk skaukatt</i></span></b>) is a breed of domestic cat originating in Northern Europe.',
				'A test case for when the element with "schema-how-to-total-time" class name is not output in the content',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text"><script>alert(1)</script>&nbsp;</span>2 hours</p>',
				[
					'durationText'        => '<script>alert(1)</script>',
					'defaultDurationText' => 'Time needed:',
					'hours'               => 2,
					'minutes'             => 0,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 hours</p>',
				'Regression test: script tags in durationText must be escaped',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text"><img src=x onerror=alert(1)>&nbsp;</span>2 hours</p>',
				[
					'durationText'        => '<img src=x onerror=alert(1)>',
					'defaultDurationText' => 'Time needed:',
					'hours'               => 2,
					'minutes'             => 0,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 hours</p>',
				'Regression test: HTML event handlers in durationText must be escaped',
			],
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text"><a href="https://evil.com">Click here</a>&nbsp;</span>2 hours</p>',
				[
					'durationText'        => '<a href="https://evil.com">Click here</a>',
					'defaultDurationText' => 'Time needed:',
					'hours'               => 2,
					'minutes'             => 0,
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">Time needed:&nbsp;</span>2 hours</p>',
				'Regression test: HTML links in durationText must be escaped to prevent content injection',
			],
		];
	}

	/**
	 * Tests that present returns the expected content.
	 *
	 * @covers       ::present_duration_text
	 * @dataProvider how_to_block_provider
	 *
	 * @param string $expected   The expected content.
	 * @param array  $attributes The block attributes.
	 * @param string $content    The post content.
	 * @param string $message    The error message if the assert fails.
	 *
	 * @return void
	 */
	public function test_present_duration_text( $expected, $attributes, $content, $message ) {
		$this->assertSame(
			$expected,
			$this->instance->present_duration_text(
				$attributes,
				$content,
			),
			$message,
		);
	}

	/**
	 * Data provider for the optimize_how_to_images method.
	 *
	 * @return array[]
	 */
	public static function how_to_images_provider() {
		return [
			[
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">The amount of time it will take:&nbsp;</span>2 hours and 20 minutes</p>'
				. '<ol class="schema-how-to-steps"><li class="schema-how-to-step" id="how-to-step-1688388022851">'
				. '<strong class="schema-how-to-step-name">Step 1</strong> <p class="schema-how-to-step-text">Do this step</p>'
				. '</li><li class="schema-how-to-step" id="how-to-step-1688636978021"><strong class="schema-how-to-step-name">'
				. 'Step 2</strong> <p class="schema-how-to-step-text">Do those steps</p> </li></ol>',
				[
					'durationText'        => 'The amount of time it will take:',
					'defaultDurationText' => 'Time needed:',
					'hours'               => 2,
					'minutes'             => 20,
					'steps'               => [
						[
							'id'       => 'how-to-step-1688388022851',
							'name'     => '',
							'text'     => 'Step 1',
							'jsonName' => 'Step 1',
							'jsonText' => 'Do this step',
						],
					],
				],
				'<p class="schema-how-to-total-time"><span class="schema-how-to-duration-time-text">The amount of time it will take:&nbsp;</span>2 hours and 20 minutes</p>'
				. '<ol class="schema-how-to-steps"><li class="schema-how-to-step" id="how-to-step-1688388022851">'
				. '<strong class="schema-how-to-step-name">Step 1</strong> <p class="schema-how-to-step-text">Do this step</p>'
				. '</li><li class="schema-how-to-step" id="how-to-step-1688636978021"><strong class="schema-how-to-step-name">'
				. 'Step 2</strong> <p class="schema-how-to-step-text">Do those steps</p> </li></ol>',
				'A test case for when there is no image in the block',
			],
		];
	}

	/**
	 * Tests that present returns the expected content.
	 *
	 * @covers       ::optimize_how_to_images
	 * @dataProvider how_to_images_provider
	 *
	 * @param string $expected   The expected content.
	 * @param array  $attributes The block attributes.
	 * @param string $content    The post content.
	 * @param string $message    The error message if the assert fails.
	 *
	 * @return void
	 */
	public function test_optimize_how_to_images( $expected, $attributes, $content, $message ) {
		Monkey\Functions\expect( 'register_shutdown_function' )
			->withAnyArgs()
			->andReturn( true );

		$this->assertSame(
			$expected,
			$this->instance->optimize_how_to_images(
				$attributes,
				$content,
			),
			$message,
		);
	}

	/**
	 * Tests that custom inline alt text is preserved.
	 *
	 * @covers ::optimize_how_to_images
	 *
	 * @return void
	 */
	public function test_optimize_how_to_images_preserves_custom_inline_alt_text() {
		global $post;
		$post = (object) [ 'ID' => 42 ];

		$src     = 'https://example.com/image.jpg';
		$content = '<p><img src="' . $src . '" alt="Custom inline alt text" /></p>';

		Monkey\Functions\expect( 'register_shutdown_function' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_structured_data_blocks_image_size', 'full', 123, $src )
			->andReturn( 'full' );

		Monkey\Functions\expect( 'wp_get_attachment_image' )
			->once()
			->with(
				123,
				'full',
				false,
				[
					'style' => 'max-width: 100%; height: auto;',
					'alt'   => 'Custom inline alt text',
				],
			)
			->andReturn( '<img src="' . $src . '" alt="Custom inline alt text" />' );

		$attributes = [
			'steps' => [
				[
					'images' => [
						[
							'type'  => 'img',
							'key'   => 123,
							'props' => [
								'src' => $src,
							],
						],
					],
				],
			],
		];

		$this->assertSame(
			'<p><img src="' . $src . '" alt="Custom inline alt text" /></p>',
			$this->instance->optimize_how_to_images( $attributes, $content ),
		);
	}

	/**
	 * Tests that entities in alt text are decoded before image generation and re-encoded in output.
	 *
	 * @covers ::optimize_how_to_images
	 *
	 * @return void
	 */
	public function test_optimize_how_to_images_decodes_and_reencodes_alt_entities() {
		global $post;
		$post = (object) [ 'ID' => 43 ];

		$src            = 'https://example.com/image.jpg';
		$encoded_alt    = 'Tom &amp; Jerry&#039;s &quot;Guide&quot;';
		$decoded_alt    = 'Tom & Jerry\'s "Guide"';
		$re_encoded_alt = \htmlspecialchars( $decoded_alt, ( \ENT_QUOTES | \ENT_HTML5 ), 'UTF-8' );
		$content        = '<p><img src="' . $src . '" alt="' . $encoded_alt . '" /></p>';

		Monkey\Functions\expect( 'register_shutdown_function' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_structured_data_blocks_image_size', 'full', 123, $src )
			->andReturn( 'full' );

		Monkey\Functions\expect( 'wp_get_attachment_image' )
			->once()
			->with(
				123,
				'full',
				false,
				[
					'style' => 'max-width: 100%; height: auto;',
					'alt'   => $decoded_alt,
				],
			)
			->andReturn( '<img src="' . $src . '" alt="' . $re_encoded_alt . '" />' );

		$attributes = [
			'steps' => [
				[
					'images' => [
						[
							'type'  => 'img',
							'key'   => 123,
							'props' => [
								'src' => $src,
							],
						],
					],
				],
			],
		];

		$this->assertSame(
			'<p><img src="' . $src . '" alt="' . $re_encoded_alt . '" /></p>',
			$this->instance->optimize_how_to_images( $attributes, $content ),
		);
	}

	/**
	 * Tests that an empty alt attribute is preserved.
	 *
	 * @covers ::optimize_how_to_images
	 *
	 * @return void
	 */
	public function test_optimize_how_to_images_preserves_empty_alt_attribute() {
		global $post;
		$post = (object) [ 'ID' => 44 ];

		$src     = 'https://example.com/image.jpg';
		$content = '<p><img src="' . $src . '" alt="" /></p>';

		Monkey\Functions\expect( 'register_shutdown_function' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_structured_data_blocks_image_size', 'full', 123, $src )
			->andReturn( 'full' );

		Monkey\Functions\expect( 'wp_get_attachment_image' )
			->once()
			->with(
				123,
				'full',
				false,
				[
					'style' => 'max-width: 100%; height: auto;',
					'alt'   => '',
				],
			)
			->andReturn( '<img src="' . $src . '" alt="" />' );

		$attributes = [
			'steps' => [
				[
					'images' => [
						[
							'type'  => 'img',
							'key'   => 123,
							'props' => [
								'src' => $src,
							],
						],
					],
				],
			],
		];

		$this->assertSame(
			'<p><img src="' . $src . '" alt="" /></p>',
			$this->instance->optimize_how_to_images( $attributes, $content ),
		);
	}

	/**
	 * Tests that missing alt attribute falls back to media library alt text.
	 *
	 * @covers ::optimize_how_to_images
	 *
	 * @return void
	 */
	public function test_optimize_how_to_images_missing_alt_falls_back_to_media_library() {
		global $post;
		$post = (object) [ 'ID' => 45 ];

		$src     = 'https://example.com/image.jpg';
		$content = '<p><img src="' . $src . '" /></p>';

		Monkey\Functions\expect( 'register_shutdown_function' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_structured_data_blocks_image_size', 'full', 123, $src )
			->andReturn( 'full' );

		Monkey\Functions\expect( 'wp_get_attachment_image' )
			->once()
			->with(
				123,
				'full',
				false,
				[
					'style' => 'max-width: 100%; height: auto;',
				],
			)
			->andReturn( '<img src="' . $src . '" alt="Media library alt" />' );

		$attributes = [
			'steps' => [
				[
					'images' => [
						[
							'type'  => 'img',
							'key'   => 123,
							'props' => [
								'src' => $src,
							],
						],
					],
				],
			],
		];

		$this->assertSame(
			'<p><img src="' . $src . '" alt="Media library alt" /></p>',
			$this->instance->optimize_how_to_images( $attributes, $content ),
		);
	}
}
