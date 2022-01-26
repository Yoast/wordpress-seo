<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Services\Importing\Aioseo_Social_Images_Provider_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Social_Images_Provider_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Aioseo_Social_Images_Provider_Service
 * @phpcs:disable Yoast.Yoast.AlternativeFunctions.json_encode_json_encode,Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Social_Images_Provider_Service_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Aioseo_Social_Images_Provider_Service
	 */
	protected $aioseo_social_images_provider_service;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->aioseo_social_images_provider_service = new Aioseo_Social_Images_Provider_Service();
	}

	/**
	 * Tests retrieving the global default social image if there is any.
	 *
	 * @param string $aioseo_options The AIOSEO settings coming from the db.
	 * @param string $social_setting The social settings we're working with, eg. open-graph or twitter.
	 * @param string $expected_url   The The URL that's expected to be retrieved.
	 *
	 * @dataProvider provider_get_default_social_image
	 * @covers ::get_default_social_image
	 */
	public function test_get_default_social_image( $aioseo_options, $social_setting, $expected_url ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'aioseo_options', '' )
			->andReturn( $aioseo_options );

		$actual_url = $this->aioseo_social_images_provider_service->get_default_social_image( $social_setting );
		$this->assertSame( $expected_url, $actual_url );
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return string
	 */
	public function provider_get_default_social_image() {
		$image_url      = 'https://example.com/image.png';
		$empty_settings = [];

		$fb_default_image            = [
			'social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'default',
						'defaultImagePosts'       => $image_url,
					],
				],
			],
		];
		$fb_no_default_image         = [
			'social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'featured-image',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];
		$fb_malformed_no_general_key = [
			'social' => [
				'facebook' => [
					'no_general' => [
						'defaultImageSourcePosts' => 'irrelevant',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];
		$fb_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'irrelevant',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];


		$twitter_default_image            = [
			'social' => [
				'twitter' => [
					'general' => [
						'defaultImageSourcePosts' => 'default',
						'defaultImagePosts'       => $image_url,
					],
				],
			],
		];
		$twitter_no_default_image         = [
			'social' => [
				'twitter' => [
					'general' => [
						'defaultImageSourcePosts' => 'featured-image',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];
		$twitter_malformed_no_general_key = [
			'social' => [
				'twitter' => [
					'no_general' => [
						'defaultImageSourcePosts' => 'irrelevant',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];
		$twitter_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'irrelevant',
						'defaultImagePosts'       => 'irrelevant',
					],
				],
			],
		];

		return [
			[ \json_encode( $empty_settings ), 'irrelevant', null ],
			[ \json_encode( $fb_default_image ), 'og', $image_url ],
			[ \json_encode( $fb_no_default_image ), 'og', null ],
			[ \json_encode( $fb_malformed_no_general_key ), 'og', null ],
			[ \json_encode( $fb_malformed_no_social_key ), 'og', null ],
			[ \json_encode( $twitter_default_image ), 'twitter', $image_url ],
			[ \json_encode( $twitter_no_default_image ), 'twitter', null ],
			[ \json_encode( $twitter_malformed_no_general_key ), 'twitter', null ],
			[ \json_encode( $twitter_malformed_no_social_key ), 'twitter', null ],
		];
	}
}
