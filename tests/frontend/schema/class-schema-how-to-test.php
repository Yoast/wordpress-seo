<?php

namespace Yoast\WP\Free\Tests\Frontend\Schema;

use Yoast\WP\Free\Tests\TestCase;
use \WPSEO_Schema_HowTo_Double;
use \WPSEO_Schema_Context;
use \Mockery;

/**
 * Class WPSEO_Schema_HowTo_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class WPSEO_Schema_HowTo_Test extends TestCase {
	/**
	 * Tests the HowTo schema output without any steps.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 */
	public function test_schema_output_no_steps() {
		$context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$context->title     = 'title';
		$context->canonical = 'canonical';

		$instance = $this->getMockBuilder( WPSEO_Schema_HowTo_Double::class )
			->setMethods( [ 'get_main_schema_id' ] )
			->setConstructorArgs( [ $context ] )
			->getMock();

		$instance->method( 'get_main_schema_id' )->willReturn( 'https://example.com/#article' );

		$actual = $instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name' => 'title',
					'steps' => [],
				],
			]
		);


		$expected = [
			[
				'@id' => 'OtherGraphPiece'
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'canonical#howto-1',
				'name'             => 'title',
				'mainEntityOfPage' => [ '@id' => 'https://example.com/#article' ],
				'description'      => 'description',
			]
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests the HowTo schema output with steps.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_steps() {
		$context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$context->title     = 'title';
		$context->canonical = 'canonical';

		$instance = $this->getMockBuilder( WPSEO_Schema_HowTo_Double::class )
		                 ->setMethods( [ 'get_main_schema_id' ] )
		                 ->setConstructorArgs( [ $context ] )
		                 ->getMock();

		$instance->method( 'get_main_schema_id' )->willReturn( 'https://example.com/#article' );

		$actual = $instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text' => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece'
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'canonical#howto-1',
				'name'             => 'title',
				'mainEntityOfPage' => [ '@id' => 'https://example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type' => 'HowToStep',
						'url'   => 'canonical#step-id-1',
						'name'  => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							]
						],
					],
				],
			]
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests the HowTo schema output with steps and images.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 * @covers \WPSEO_Schema_HowTo::add_step_image
	 */
	public function test_schema_output_with_steps_and_image() {
		$context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$context->title     = 'title';
		$context->canonical = 'canonical';

		$instance = $this->getMockBuilder( WPSEO_Schema_HowTo_Double::class )
		                 ->setMethods( [ 'get_main_schema_id', 'get_image_schema' ] )
		                 ->setConstructorArgs( [ $context ] )
		                 ->getMock();

		$instance->method( 'get_main_schema_id' )->willReturn( 'https://example.com/#article' );
		$instance->method( 'get_image_schema' )->willReturn( 'https://example.com/image.png' );

		$actual = $instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text' => [
								'How to step 1 text line',
								[
									'key' => 1,
								],
							],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece'
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'canonical#howto-1',
				'name'             => 'title',
				'mainEntityOfPage' => [ '@id' => 'https://example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type' => 'HowToStep',
						'url'   => 'canonical#step-id-1',
						'name'  => 'How to step 1',
						'image' => 'https://example.com/image.png',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							]
						],
					],
				],
			]
		];

		$this->assertEquals( $actual, $expected );
	}
}
