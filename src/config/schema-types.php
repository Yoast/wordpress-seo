<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Config;

/**
 * Class Schema_Types.
 */
class Schema_Types {

	/**
	 * Holds the possible schema page types.
	 *
	 * @var string[]
	 */
	const PAGE_TYPES = [
		'web-page'            => '',
		'item-page'           => '',
		'about-page'          => '',
		'faq-page'            => '',
		'qa-page'             => '',
		'profile-page'        => '',
		'contact-page'        => '',
		'medical-web-page'    => '',
		'collection-page'     => '',
		'checkout-page'       => '',
		'real-estate-listing' => '',
		'search-results-page' => '',
		'none'                => '',
	];

	/**
	 * Holds the possible schema article types.
	 *
	 * @var string[]
	 */
	const ARTICLE_TYPES = [
		'article'                    => '',
		'social-media-posting'       => '',
		'news-article'               => '',
		'advertiser-content-article' => '',
		'satirical-article'          => '',
		'scholarly-article'          => '',
		'tech-article'               => '',
		'report'                     => '',
		'none'                       => '',
	];

	/**
	 * Gets the page type options.
	 *
	 * @return array[] The schema page type options.
	 */
	public function get_page_type_options() {
		return [
			[
				'name'  => __( 'Web Page', 'wordpress-seo' ),
				'value' => 'web-page',
			],
			[
				'name'  => __( 'Item Page', 'wordpress-seo' ),
				'value' => 'item-page',
			],
			[
				'name'  => __( 'About Page', 'wordpress-seo' ),
				'value' => 'about-page',
			],
			[
				'name'  => __( 'FAQ Page', 'wordpress-seo' ),
				'value' => 'faq-page',
			],
			[
				'name'  => __( 'QA Page', 'wordpress-seo' ),
				'value' => 'qa-page',
			],
			[
				'name'  => __( 'Profile Page', 'wordpress-seo' ),
				'value' => 'profile-page',
			],
			[
				'name'  => __( 'Contact Page', 'wordpress-seo' ),
				'value' => 'contact-page',
			],
			[
				'name'  => __( 'Medical Web Page', 'wordpress-seo' ),
				'value' => 'medical-web-page',
			],
			[
				'name'  => __( 'Collection Page', 'wordpress-seo' ),
				'value' => 'collection-page',
			],
			[
				'name'  => __( 'Checkout Page', 'wordpress-seo' ),
				'value' => 'checkout-page',
			],
			[
				'name'  => __( 'Real Estate Listing', 'wordpress-seo' ),
				'value' => 'real-estate-listing',
			],
			[
				'name'  => __( 'Search Results Page', 'wordpress-seo' ),
				'value' => 'search-results-page',
			],
			[
				'name'  => __( 'None', 'wordpress-seo' ),
				'value' => 'none',
			],
		];
	}

	/**
	 * Gets the article type options.
	 *
	 * @return array[] The schema article type options.
	 */
	public function get_article_type_options() {
		return [
			[
				'name'  => __( 'Article', 'wordpress-seo' ),
				'value' => 'article',
			],
			[
				'name'  => __( 'Social Media Posting', 'wordpress-seo' ),
				'value' => 'social-media-posting',
			],
			[
				'name'  => __( 'News Article', 'wordpress-seo' ),
				'value' => 'news-article',
			],
			[
				'name'  => __( 'Advertiser Content Article', 'wordpress-seo' ),
				'value' => 'advertiser-content-article',
			],
			[
				'name'  => __( 'Satirical Article', 'wordpress-seo' ),
				'value' => 'satirical-article',
			],
			[
				'name'  => __( 'Scholary Article', 'wordpress-seo' ),
				'value' => 'scholarly-article',
			],
			[
				'name'  => __( 'Tech Article', 'wordpress-seo' ),
				'value' => 'tech-article',
			],
			[
				'name'  => __( 'Report', 'wordpress-seo' ),
				'value' => 'report',
			],
			[
				'name'  => __( 'None', 'wordpress-seo' ),
				'value' => 'none',
			],
		];
	}
}
