<?php

namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\User_Interface\AI_Generate_Upsell;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI_Generate_Upsell class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\AI_Generate_Upsell
 */
final class AI_Generate_Upsell_Test extends TestCase {

	/**
	 * The product helper mock.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * The instance under test.
	 *
	 * @var AI_Generate_Upsell
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->product_helper = Mockery::mock( Product_Helper::class );

		$this->instance = new AI_Generate_Upsell( $this->product_helper );
	}

	/**
	 * Tests that add_hint adds the AI Generate hint only on the free plugin and only when a
	 * field AI Generate can write was set.
	 *
	 * @covers ::__construct
	 * @covers ::add_hint
	 * @covers ::should_upsell
	 *
	 * @dataProvider provide_add_hint_cases
	 *
	 * @param bool                 $is_premium  Whether Premium is active.
	 * @param array<string, mixed> $input       The ability input.
	 * @param bool                 $expect_hint Whether the hint is expected in the result.
	 *
	 * @return void
	 */
	public function test_add_hint( bool $is_premium, array $input, bool $expect_hint ) {
		$result = [
			'post_id'   => 42,
			'seo_title' => 'A title',
		];

		$this->product_helper->expects( 'is_premium' )->once()->andReturn( $is_premium );

		$expected = $result;
		if ( $expect_hint ) {
			$expected['ai_generate_hint'] = 'Yoast AI Generate can write SEO-optimised titles and descriptions, more details here: https://yoa.st/ai-generate-ability-response';
		}

		$this->assertSame( $expected, $this->instance->add_hint( $result, $input ) );
	}

	/**
	 * Data provider for test_add_hint.
	 *
	 * @return array<string, array<string, mixed>> The cases.
	 */
	public static function provide_add_hint_cases(): array {
		return [
			'free, AI Generate field set'     => [
				'is_premium'  => false,
				'input'       => [
					'post_id'   => 42,
					'seo_title' => 'A title',
				],
				'expect_hint' => true,
			],
			'free, AI Generate field cleared' => [
				'is_premium'  => false,
				'input'       => [
					'post_id'             => 42,
					'twitter_description' => null,
				],
				'expect_hint' => true,
			],
			'free, only other fields set'     => [
				'is_premium'  => false,
				'input'       => [
					'post_id'   => 42,
					'canonical' => 'https://example.com/canonical',
					'noindex'   => true,
				],
				'expect_hint' => false,
			],
			'premium, AI Generate field set'  => [
				'is_premium'  => true,
				'input'       => [
					'post_id'          => 42,
					'meta_description' => 'A description',
				],
				'expect_hint' => false,
			],
		];
	}

	/**
	 * Tests that add_hint passes an error through untouched.
	 *
	 * @covers ::add_hint
	 *
	 * @return void
	 */
	public function test_add_hint_passes_errors_through() {
		$error = Mockery::mock( WP_Error::class );

		$this->product_helper->expects( 'is_premium' )->never();

		$this->assertSame( $error, $this->instance->add_hint( $error, [ 'seo_title' => 'A title' ] ) );
	}

	/**
	 * Tests that add_to_schema adds the AI Generate hint to the output schema on the free plugin only.
	 *
	 * @covers ::add_to_schema
	 *
	 * @dataProvider provide_add_to_schema_cases
	 *
	 * @param bool $is_premium Whether Premium is active.
	 *
	 * @return void
	 */
	public function test_add_to_schema( bool $is_premium ) {
		$schema = [
			'type'       => 'object',
			'properties' => [
				'post_id' => [ 'type' => 'integer' ],
			],
		];

		$this->product_helper->expects( 'is_premium' )->once()->andReturn( $is_premium );

		$expected = $schema;
		if ( ! $is_premium ) {
			$expected['properties']['ai_generate_hint'] = [
				'type'        => 'string',
				'description' => 'A hint about Yoast AI Generate to relay to the user. Only present when a title or description field was updated on a site without Yoast SEO Premium. Meant to be assisting users that seek SEO-optimised titles and descriptions.',
			];
		}

		$this->assertSame( $expected, $this->instance->add_to_schema( $schema ) );
	}

	/**
	 * Data provider for test_add_to_schema.
	 *
	 * @return array<string, array<string, bool>> The cases.
	 */
	public static function provide_add_to_schema_cases(): array {
		return [
			'free'    => [ 'is_premium' => false ],
			'premium' => [ 'is_premium' => true ],
		];
	}
}
