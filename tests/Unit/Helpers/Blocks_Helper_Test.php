<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Blocks_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Blocks_Helper
 */
final class Blocks_Helper_Test extends TestCase {

	/**
	 * Represents the post helper.
	 *
	 * @var Mockery\MockInterface|Blocks_Helper
	 */
	private $post;

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Blocks_Helper
	 */
	private $instance;

	/**
	 * Set up a new instance of the class under test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post = Mockery::mock( Post_Helper::class );

		$this->instance = Mockery::mock( Blocks_Helper::class, [ $this->post ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests retrieval of the blocks from the given post.
	 *
	 * @covers ::get_all_blocks_from_post
	 *
	 * @return void
	 */
	public function test_get_all_blocks_from_post() {
		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( (object) [ 'post_content' => 'post content' ] );

		$this->instance
			->expects( 'has_blocks_support' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_all_blocks_from_content' )
			->once()
			->with( 'post content' )
			->andReturn( [ 'block' ] );

		$this->assertEquals( [ 'block' ], $this->instance->get_all_blocks_from_post( 1337 ) );
	}

	/**
	 * Tests retrieval of the blocks from the given post but with not having blocks support.
	 *
	 * @covers ::get_all_blocks_from_post
	 *
	 * @return void
	 */
	public function test_get_all_blocks_from_post_with_no_block_support() {
		$this->instance
			->expects( 'has_blocks_support' )
			->once()
			->andReturnFalse();

		$this->instance->expects( 'get_all_blocks_from_content' )->never();

		$this->assertEquals( [], $this->instance->get_all_blocks_from_post( 1337 ) );
	}

	/**
	 * Tests retrieval of the blocks from the given content.
	 *
	 * @covers ::get_all_blocks_from_content
	 * @covers ::collect_blocks
	 *
	 * @return void
	 */
	public function test_get_all_blocks_from_content() {
		Monkey\Functions\expect( 'parse_blocks' )
			->once()
			->with( 'post content' )
			->andReturn(
				[
					[
						'blockName'        => 'Block',
						'blockDescription' => 'This is a block',
						'innerBlocks'      => [
							[
								'blockName'        => 'InnerBlock',
								'blockDescription' => 'This is a inner block',
							],
						],
					],
				]
			);

		$this->instance
			->expects( 'has_blocks_support' )
			->once()
			->andReturnTrue();

		$this->assertEquals(
			[
				'Block'      => [
					[
						'blockName'        => 'Block',
						'blockDescription' => 'This is a block',
						'innerBlocks'      => [
							[
								'blockName'        => 'InnerBlock',
								'blockDescription' => 'This is a inner block',
							],
						],
					],
				],
				'InnerBlock' => [
					[
						'blockName'        => 'InnerBlock',
						'blockDescription' => 'This is a inner block',
					],
				],
			],
			$this->instance->get_all_blocks_from_content( 'post content' )
		);
	}

	/**
	 * Tests retrieval of the blocks from the given content, but with no block support.
	 *
	 * @covers ::get_all_blocks_from_content
	 *
	 * @return void
	 */
	public function test_get_all_blocks_from_content_with_no_block_support() {
		Monkey\Functions\expect( 'parse_blocks' )->never();

		$this->instance
			->expects( 'has_blocks_support' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [], $this->instance->get_all_blocks_from_content( 'post content' ) );
	}
}
