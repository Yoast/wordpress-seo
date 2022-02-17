<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Import_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
/**
 * Class Import_Helper_Test
 *
 * @group actions
 * @group importing
 *
 * @package Yoast\WP\SEO\Tests\Unit\Actions\Importing
 *
 * @coversDefaultClass Yoast\WP\SEO\Helpers\Import_Helper
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Import_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Import_Helper
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		$this->instance = new Import_Helper();
	}

	/**
	 * Tests flattening settings.
	 *
	 * @param array $unflattened_settings        An array of settings to be flattened.
	 * @param array $expected_flattened_settings The expected flattened settings.
	 *
	 * @dataProvider provider_flatten_settings
	 * @covers ::flatten_settings
	 */
	public function test_flatten_settings( $unflattened_settings, $expected_flattened_settings ) {
		$flattened_settings = $this->instance->flatten_settings( $unflattened_settings );

		$this->assertSame( $expected_flattened_settings, $flattened_settings );
	}

	/**
	 * Data provider for test_map().
	 *
	 * @return array
	 */
	public function provider_flatten_settings() {

		$full_custom_archive_settings_to_import      = [
			'book'  => [
				'show'            => true,
				'title'           => 'Book Title',
				'metaDescription' => 'Book Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
			'movie' => [
				'show'            => true,
				'title'           => 'Movie Title',
				'metaDescription' => 'Movie Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
		];
		$flattened_custom_archive_settings_to_import = [
			'/book/show'                              => true,
			'/book/title'                             => 'Book Title',
			'/book/metaDescription'                   => 'Book Desc',
			'/book/advanced/showDateInGooglePreview'  => true,
			'/movie/show'                             => true,
			'/movie/title'                            => 'Movie Title',
			'/movie/metaDescription'                  => 'Movie Desc',
			'/movie/advanced/showDateInGooglePreview' => true,
		];

		$full_default_archive_settings_to_import      = [
			'author' => [
				'show'            => true,
				'title'           => 'Author Title',
				'metaDescription' => 'Author Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
			'date'   => [
				'show'            => true,
				'title'           => 'Date Title',
				'metaDescription' => 'Date Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
			'search' => [
				'show'            => true,
				'title'           => 'Search Title',
				'metaDescription' => 'Search Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
		];
		$flattened_default_archive_settings_to_import = [
			'/author/show'                             => true,
			'/author/title'                            => 'Author Title',
			'/author/metaDescription'                  => 'Author Desc',
			'/author/advanced/showDateInGooglePreview' => true,
			'/date/show'                               => true,
			'/date/title'                              => 'Date Title',
			'/date/metaDescription'                    => 'Date Desc',
			'/date/advanced/showDateInGooglePreview'   => true,
			'/search/show'                             => true,
			'/search/title'                            => 'Search Title',
			'/search/metaDescription'                  => 'Search Desc',
			'/search/advanced/showDateInGooglePreview' => true,
		];

		$full_general_settings_to_import      = [
			'separator'       => '&larr;',
			'siteTitle'       => 'Site Title',
			'metaDescription' => 'Site Desc',
			'schema'          => [
				'siteRepresents'   => 'person',
				'person'           => 60,
				'organizationName' => 'Org Name',
				'organizationLogo' => 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg',
			],
		];
		$flattened_general_settings_to_import = [
			'/separator'               => '&larr;',
			'/siteTitle'               => 'Site Title',
			'/metaDescription'         => 'Site Desc',
			'/schema/siteRepresents'   => 'person',
			'/schema/person'           => 60,
			'/schema/organizationName' => 'Org Name',
			'/schema/organizationLogo' => 'http://basic.wordpress.test/wp-content/uploads/2021/11/WordPress8-20.jpg',
		];

		$full_posttype_defaults_settings_to_import      = [
			'post'       => [
				'show'            => true,
				'title'           => 'Post Title',
				'metaDescription' => 'Post Desc',
				'advanced'        => [
					'robotsMeta' => [
						'default' => true,
						'noindex' => false,
					],
				],
			],
			'attachment' => [
				'show'                   => true,
				'title'                  => 'Media Title',
				'metaDescription'        => 'Media Desc',
				'advanced'               => [
					'robotsMeta' => [
						'default' => true,
						'noindex' => false,
					],
				],
				'redirectAttachmentUrls' => 'attachment_parent',
			],
			'page'       => [
				'show'            => true,
				'title'           => 'Page Title',
				'metaDescription' => 'Page Desc',
				'advanced'        => [
					'robotsMeta' => [
						'default' => false,
						'noindex' => true,
					],
				],
			],
		];
		$flattened_posttype_defaults_settings_to_import = [
			'/post/show'                              => true,
			'/post/title'                             => 'Post Title',
			'/post/metaDescription'                   => 'Post Desc',
			'/post/advanced/robotsMeta/default'       => true,
			'/post/advanced/robotsMeta/noindex'       => false,
			'/attachment/show'                        => true,
			'/attachment/title'                       => 'Media Title',
			'/attachment/metaDescription'             => 'Media Desc',
			'/attachment/advanced/robotsMeta/default' => true,
			'/attachment/advanced/robotsMeta/noindex' => false,
			'/attachment/redirectAttachmentUrls'      => 'attachment_parent',
			'/page/show'                              => true,
			'/page/title'                             => 'Page Title',
			'/page/metaDescription'                   => 'Page Desc',
			'/page/advanced/robotsMeta/default'       => false,
			'/page/advanced/robotsMeta/noindex'       => true,
		];

		$full_taxonomy_settings_to_import      = [
			'category'      => [
				'show'            => true,
				'title'           => 'Category Title',
				'metaDescription' => 'Category Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
			'post_tag'      => [
				'show'            => true,
				'title'           => 'Tag Title',
				'metaDescription' => 'Tag Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
			'book-category' => [
				'show'            => true,
				'title'           => 'Category Title',
				'metaDescription' => 'Category Desc',
				'advanced'        => [
					'showDateInGooglePreview' => true,
				],
			],
		];
		$flattened_taxonomy_settings_to_import = [
			'/category/show'                                  => true,
			'/category/title'                                 => 'Category Title',
			'/category/metaDescription'                       => 'Category Desc',
			'/category/advanced/showDateInGooglePreview'      => true,
			'/post_tag/show'                                  => true,
			'/post_tag/title'                                 => 'Tag Title',
			'/post_tag/metaDescription'                       => 'Tag Desc',
			'/post_tag/advanced/showDateInGooglePreview'      => true,
			'/book-category/show'                             => true,
			'/book-category/title'                            => 'Category Title',
			'/book-category/metaDescription'                  => 'Category Desc',
			'/book-category/advanced/showDateInGooglePreview' => true,
		];
		return [
			[ $full_custom_archive_settings_to_import, $flattened_custom_archive_settings_to_import ],
			[ $full_default_archive_settings_to_import, $flattened_default_archive_settings_to_import ],
			[ $full_general_settings_to_import, $flattened_general_settings_to_import ],
			[ $full_posttype_defaults_settings_to_import, $flattened_posttype_defaults_settings_to_import ],
			[ $full_taxonomy_settings_to_import, $flattened_taxonomy_settings_to_import ],
		];
	}
}
