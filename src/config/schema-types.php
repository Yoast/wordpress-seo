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
	 * Capitalized in this way so the value can be directly used in the schema output.
	 *
	 * @var string[]
	 */
	const PAGE_TYPES = [
		'WebPage'           => '',
		'ItemPage'          => '',
		'AboutPage'         => '',
		'FAQPage'           => '',
		'QAPage'            => '',
		'ProfilePage'       => '',
		'ContactPage'       => '',
		'MedicalWebPage'    => '',
		'CollectionPage'    => '',
		'CheckoutPage'      => '',
		'RealEstateListing' => '',
		'SearchResultsPage' => '',
	];

	/**
	 * Holds the possible schema article types.
	 *
	 * Capitalized in this way so the value can be directly used in the schema output.
	 *
	 * @var string[]
	 */
	const ARTICLE_TYPES = [
		'Article'                  => '',
		'SocialMediaPosting'       => '',
		'NewsArticle'              => '',
		'AdvertiserContentArticle' => '',
		'SatiricalArticle'         => '',
		'ScholarlyArticle'         => '',
		'TechArticle'              => '',
		'Report'                   => '',
		'None'                     => '',
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
				'value' => 'WebPage',
			],
			[
				'name'  => __( 'Item Page', 'wordpress-seo' ),
				'value' => 'ItemPage',
			],
			[
				'name'  => __( 'About Page', 'wordpress-seo' ),
				'value' => 'AboutPage',
			],
			[
				'name'  => __( 'FAQ Page', 'wordpress-seo' ),
				'value' => 'FAQPage',
			],
			[
				'name'  => __( 'QA Page', 'wordpress-seo' ),
				'value' => 'QAPage',
			],
			[
				'name'  => __( 'Profile Page', 'wordpress-seo' ),
				'value' => 'ProfilePage',
			],
			[
				'name'  => __( 'Contact Page', 'wordpress-seo' ),
				'value' => 'ContactPage',
			],
			[
				'name'  => __( 'Medical Web Page', 'wordpress-seo' ),
				'value' => 'MedicalWebPage',
			],
			[
				'name'  => __( 'Collection Page', 'wordpress-seo' ),
				'value' => 'CollectionPage',
			],
			[
				'name'  => __( 'Checkout Page', 'wordpress-seo' ),
				'value' => 'CheckoutPage',
			],
			[
				'name'  => __( 'Real Estate Listing', 'wordpress-seo' ),
				'value' => 'RealEstateListing',
			],
			[
				'name'  => __( 'Search Results Page', 'wordpress-seo' ),
				'value' => 'SearchResultsPage',
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
				'value' => 'Article',
			],
			[
				'name'  => __( 'Social Media Posting', 'wordpress-seo' ),
				'value' => 'SocialMediaPosting',
			],
			[
				'name'  => __( 'News Article', 'wordpress-seo' ),
				'value' => 'NewsArticle',
			],
			[
				'name'  => __( 'Advertiser Content Article', 'wordpress-seo' ),
				'value' => 'AdvertiserContentArticle',
			],
			[
				'name'  => __( 'Satirical Article', 'wordpress-seo' ),
				'value' => 'SatiricalArticle',
			],
			[
				'name'  => __( 'Scholary Article', 'wordpress-seo' ),
				'value' => 'ScholarlyArticle',
			],
			[
				'name'  => __( 'Tech Article', 'wordpress-seo' ),
				'value' => 'TechArticle',
			],
			[
				'name'  => __( 'Report', 'wordpress-seo' ),
				'value' => 'Report',
			],
			[
				'name'  => __( 'None', 'wordpress-seo' ),
				'value' => 'None',
			],
		];
	}
}
