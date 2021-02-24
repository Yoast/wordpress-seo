<?php
namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Third_Party\GraphQL_Activated_Conditional;

/**
 * Adds the WP GraphQL integration for Yoast SEO.
 */
class WP_GraphQL_Integration implements Integration_Interface {

	use WPGraphQL\AppContext;

	/**
	 * WP GraphQL integration constructor.
	 */
	public function __construct() {
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ GraphQL_Activated_Conditional::class ];
	}

	/**
	 * Registers the GraphQL types.
	 */
	public function register_hooks() {
		add_action( 'graphql_register_types', [ $this, 'register_types' ] );
	}

	public function register_types() {
		$post_types = \WPGraphQL::get_allowed_post_types();
		$taxonomies = \WPGraphQL::get_allowed_taxonomies();

		// If WooCommerce installed then add these post types and taxonomies
		if (class_exists('\WooCommerce')) {
			array_push($post_types, 'product');
			array_push($taxonomies, 'productCategory');
		}

		\register_graphql_enum_type( 'SEOCardType', [
			'description' => __('Types of cards', 'wordpress-seo'),
			'values' => [
				'summary_large_image' => [
					'value' => 'summary_large_image',
				],
				'summary' => [
					'value' => 'summary',
				],
			],
		]);

		\register_graphql_object_type('SEOPostTypeSchema', [
			'description' => __('The Schema types', 'wordpress-seo'),
			'fields' => [
				'pageType' => ['type' => ['list_of' => 'String']],
				'articleType' => ['type' => ['list_of' => 'String']],
				'raw' => ['type' => 'String'],
			],
		]);
		\register_graphql_object_type('SEOTaxonomySchema', [
			'description' => __(
				'The Schema types for Taxonomy',
				'wordpress-seo'
			),
			'fields' => [
				'raw' => ['type' => 'String'],
			],
		]);

		$baseSEOFields = [
			'title' => ['type' => 'String'],
			'metaDesc' => ['type' => 'String'],
			'focuskw' => ['type' => 'String'],
			'metaKeywords' => ['type' => 'String'],
			'metaRobotsNoindex' => ['type' => 'String'],
			'metaRobotsNofollow' => ['type' => 'String'],
			'opengraphTitle' => ['type' => 'String'],
			'opengraphUrl' => ['type' => 'String'],
			'opengraphSiteName' => ['type' => 'String'],
			'opengraphType' => ['type' => 'String'],
			'opengraphAuthor' => ['type' => 'String'],
			'opengraphPublisher' => ['type' => 'String'],
			'opengraphPublishedTime' => ['type' => 'String'],
			'opengraphModifiedTime' => ['type' => 'String'],
			'opengraphDescription' => ['type' => 'String'],
			'opengraphImage' => ['type' => 'MediaItem'],
			'twitterTitle' => ['type' => 'String'],
			'twitterDescription' => ['type' => 'String'],
			'twitterImage' => ['type' => 'MediaItem'],
			'canonical' => ['type' => 'String'],
			'breadcrumbs' => ['type' => ['list_of' => 'SEOPostTypeBreadcrumbs']],
			'cornerstone' => ['type' => 'Boolean'],
		];

		\register_graphql_object_type('TaxonomySEO', [
			'fields' => array_merge( $baseSEOFields, [
				'schema' => ['type' => 'SEOTaxonomySchema'],
			]),
		]);

		\register_graphql_object_type('PostTypeSEO', [
			'fields' => array_merge( $baseSEOFields, [
				'schema' => ['type' => 'SEOPostTypeSchema'],
			]),
		]);

		\register_graphql_object_type('SEOPostTypeBreadcrumbs', [
			'fields' => [
				'url' => ['type' => 'String'],
				'text' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOSchema', [
			'description' => __('The Yoast SEO schema data', 'wordpress-seo'),
			'fields' => [
				'companyName' => ['type' => 'String'],
				'personName' => ['type' => 'String'],
				'companyOrPerson' => ['type' => 'String'],
				'companyLogo' => ['type' => 'MediaItem'],
				'personLogo' => ['type' => 'MediaItem'],
				'logo' => ['type' => 'MediaItem'],
				'siteName' => ['type' => 'String'],
				'wordpressSiteName' => ['type' => 'String'],
				'siteUrl' => ['type' => 'String'],
				'inLanguage' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOWebmaster', [
			'description' => __(
				'The Yoast SEO  webmaster fields',
				'wordpress-seo'
			),
			'fields' => [
				'baiduVerify' => ['type' => 'String'],
				'googleVerify' => ['type' => 'String'],
				'msVerify' => ['type' => 'String'],
				'yandexVerify' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOBreadcrumbs', [
			'description' => __(
				'The Yoast SEO breadcrumb config',
				'wordpress-seo'
			),
			'fields' => [
				'enabled' => ['type' => 'Boolean'],
				'boldLast' => ['type' => 'Boolean'],
				'showBlogPage' => ['type' => 'Boolean'],
				'notFoundText' => ['type' => 'String'],
				'archivePrefix' => ['type' => 'String'],
				'homeText' => ['type' => 'String'],
				'prefix' => ['type' => 'String'],
				'searchPrefix' => ['type' => 'String'],
				'separator' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOSocialFacebook', [
			'fields' => [
				'url' => ['type' => 'String'],
				'defaultImage' => ['type' => 'MediaItem'],
			],
		]);

		\register_graphql_object_type('SEOSocialTwitter', [
			'fields' => [
				'username' => ['type' => 'String'],
				'cardType' => ['type' => 'SEOCardType'],
			],
		]);

		\register_graphql_object_type('SEOSocialInstagram', [
			'fields' => [
				'url' => ['type' => 'String'],
			],
		]);
		\register_graphql_object_type('SEOSocialLinkedIn', [
			'fields' => [
				'url' => ['type' => 'String'],
			],
		]);
		\register_graphql_object_type('SEOSocialMySpace', [
			'fields' => [
				'url' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOSocialPinterest', [
			'fields' => [
				'url' => ['type' => 'String'],
				'metaTag' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOSocialYoutube', [
			'fields' => [
				'url' => ['type' => 'String'],
			],
		]);
		\register_graphql_object_type('SEOSocialWikipedia', [
			'fields' => [
				'url' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOSocial', [
			'description' => __(
				'The Yoast SEO Social media links',
				'wordpress-seo'
			),
			'fields' => [
				'facebook' => ['type' => 'SEOSocialFacebook'],
				'twitter' => ['type' => 'SEOSocialTwitter'],
				'instagram' => ['type' => 'SEOSocialInstagram'],
				'linkedIn' => ['type' => 'SEOSocialLinkedIn'],
				'mySpace' => ['type' => 'SEOSocialMySpace'],
				'pinterest' => ['type' => 'SEOSocialPinterest'],
				'youTube' => ['type' => 'SEOSocialYoutube'],
				'wikipedia' => ['type' => 'SEOSocialWikipedia'],
			],
		]);

		\register_graphql_object_type('SEORedirect', [
			'description' => __(
				'The Yoast redirect data  (Yoast Premium only)',
				'wordpress-seo'
			),
			'fields' => [
				'origin' => ['type' => 'String'],
				'target' => ['type' => 'String'],
				'type' => ['type' => 'Int'],
				'format' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOOpenGraphFrontPage', [
			'description' => __(
				'The Open Graph Front page data',
				'wordpress-seo'
			),
			'fields' => [
				'title' => ['type' => 'String'],
				'description' => ['type' => 'String'],
				'image' => ['type' => 'MediaItem'],
			],
		]);

		\register_graphql_object_type('SEOOpenGraph', [
			'description' => __('The Open Graph data', 'wordpress-seo'),
			'fields' => [
				'defaultImage' => ['type' => 'MediaItem'],
				'frontPage' => ['type' => 'SEOOpenGraphFrontPage'],
			],
		]);

		\register_graphql_object_type('SEOContentType', [
			'description' => __(
				'he Yoast SEO search appearance content types fields',
				'wordpress-seo'
			),
			'fields' => [
				'title' => ['type' => 'String'],
				'metaDesc' => ['type' => 'String'],
				'metaRobotsNoindex' => ['type' => 'Boolean'],
				'schemaType' => ['type' => 'String'],
				'schema' => ['type' => 'SEOPageInfoSchema'],
			],
		]);

		$allTypes = $this->build_content_types($post_types);

		\register_graphql_object_type('SEOContentTypes', [
			'description' => __(
				'The Yoast SEO search appearance content types',
				'wordpress-seo'
			),
			'fields' => $allTypes,
		]);

		\register_graphql_object_type('SEOConfig', [
			'description' => __(
				'The Yoast SEO site level configuration data',
				'wordpress-seo'
			),
			'fields' => [
				'schema' => ['type' => 'SEOSchema'],
				'webmaster' => ['type' => 'SEOWebmaster'],
				'social' => ['type' => 'SEOSocial'],
				'breadcrumbs' => ['type' => 'SEOBreadcrumbs'],
				'redirects' => [
					'type' => [
						'list_of' => 'SEORedirect',
					],
				],
				'openGraph' => ['type' => 'SEOOpenGraph'],
				'contentTypes' => ['type' => 'SEOContentTypes'],
			],
		]);

		\register_graphql_object_type('SEOUserSocial', [
			'fields' => [
				'facebook' => ['type' => 'String'],
				'twitter' => ['type' => 'String'],
				'instagram' => ['type' => 'String'],
				'linkedIn' => ['type' => 'String'],
				'mySpace' => ['type' => 'String'],
				'pinterest' => ['type' => 'String'],
				'youTube' => ['type' => 'String'],
				'soundCloud' => ['type' => 'String'],
				'wikipedia' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOUserSchema', [
			'description' => __('The Schema types for User', 'wordpress-seo'),
			'fields' => [
				'raw' => ['type' => 'String'],
			],
		]);

		\register_graphql_object_type('SEOUser', [
			'fields' => [
				'title' => ['type' => 'String'],
				'metaDesc' => ['type' => 'String'],
				'metaRobotsNoindex' => ['type' => 'String'],
				'metaRobotsNofollow' => ['type' => 'String'],
				'social' => ['type' => 'SEOUserSocial'],
				'schema' => ['type' => 'SEOUserSchema'],
			],
		]);

		\register_graphql_object_type('SEOPageInfoSchema', [
			'description' => __('The Schema for post type', 'wordpress-seo'),
			'fields' => [
				'raw' => ['type' => 'String'],
			],
		]);
		\register_graphql_object_type('SEOPostTypePageInfo', [
			'description' => __('The page info SEO details', 'wordpress-seo'),
			'fields' => [
				'schema' => ['type' => 'SEOPageInfoSchema'],
			],
		]);

		register_graphql_field('RootQuery', 'seo', [
			'type' => 'SEOConfig',
			'description' => __('Returns seo site data', 'wordpress-seo'),
			'resolve' => function ($source, array $args, AppContext $context) use (
				$post_types
			) {
				$wpseo_options = WPSEO_Options::get_instance();
				$all = $wpseo_options->get_all();

				$redirectsObj = class_exists('WPSEO_Redirect_Option')
					? new WPSEO_Redirect_Option()
					: false;
				$redirects = $redirectsObj ? $redirectsObj->get_from_option() : [];

				$userID = $all['company_or_person_user_id'];
				$user = get_userdata($userID);

				$mappedRedirects = function ($value) {
					return [
						'origin' => $value['origin'],
						'target' => $value['url'],
						'type' => $value['type'],
						'format' => $value['format'],
					];
				};

				$contentTypes = $this->build_content_type_data(
					$post_types,
					$all
				);

				return [
					'contentTypes' => $contentTypes,
					'webmaster' => [
						'baiduVerify' => $this->format_string(
							$all['baiduverify']
						),
						'googleVerify' => $this->format_string(
							$all['googleverify']
						),
						'msVerify' => $this->format_string($all['msverify']),
						'yandexVerify' => $this->format_string(
							$all['yandexverify']
						),
					],
					'social' => [
						'facebook' => [
							'url' => $this->format_string($all['facebook_site']),
							'defaultImage' => $context
								->get_loader('post')
								->load_deferred($all['og_default_image_id']),
						],
						'twitter' => [
							'username' => $this->format_string(
								$all['twitter_site']
							),
							'cardType' => $this->format_string(
								$all['twitter_card_type']
							),
						],
						'instagram' => [
							'url' => $this->format_string($all['instagram_url']),
						],
						'linkedIn' => [
							'url' => $this->format_string($all['linkedin_url']),
						],
						'mySpace' => [
							'url' => $this->format_string($all['myspace_url']),
						],
						'pinterest' => [
							'url' => $this->format_string($all['pinterest_url']),
							'metaTag' => $this->format_string(
								$all['pinterestverify']
							),
						],
						'youTube' => [
							'url' => $this->format_string($all['youtube_url']),
						],
						'wikipedia' => [
							'url' => $this->format_string($all['wikipedia_url']),
						],
					],
					'breadcrumbs' => [
						'enabled' => $this->format_string(
							$all['breadcrumbs-enable']
						),
						'boldLast' => $this->format_string(
							$all['breadcrumbs-boldlast']
						),
						'showBlogPage' => $this->format_string(
							$all['breadcrumbs-display-blog-page']
						),
						'archivePrefix' => $this->format_string(
							$all['breadcrumbs-archiveprefix']
						),
						'prefix' => $this->format_string(
							$all['breadcrumbs-prefix']
						),
						'notFoundText' => $this->format_string(
							$all['breadcrumbs-404crumb']
						),
						'homeText' => $this->format_string(
							$all['breadcrumbs-home']
						),
						'searchPrefix' => $this->format_string(
							$all['breadcrumbs-searchprefix']
						),
						'separator' => $this->format_string(
							$all['breadcrumbs-sep']
						),
					],
					'schema' => [
						'companyName' => $this->format_string(
							$all['company_name']
						),
						'personName' => $this->format_string(
							$user->user_nicename
						),
						'companyLogo' => $context
							->get_loader('post')
							->load_deferred(absint($all['company_logo_id'])),
						'personLogo' => $context
							->get_loader('post')
							->load_deferred(absint($all['person_logo_id'])),
						'logo' => $context
							->get_loader('post')
							->load_deferred(
								$all['company_or_person'] === 'company'
									? absint($all['company_logo_id'])
									: absint($all['person_logo_id'])
							),
						'companyOrPerson' => $this->format_string(
							$all['company_or_person']
						),
						'siteName' => $this->format_string(
							YoastSEO()->helpers->site->get_site_name()
						),
						'wordpressSiteName' => $this->format_string(
							get_bloginfo('name')
						),
						'siteUrl' => $this->format_string(get_site_url()),
						'inLanguage' => $this->format_string(
							get_bloginfo('language')
						),
					],
					'redirects' => array_map($mappedRedirects, $redirects),
					'openGraph' => [
						'defaultImage' => $context
							->get_loader('post')
							->load_deferred(absint($all['og_default_image_id'])),
						'frontPage' => [
							'title' => $this->format_string(
								$all['og_frontpage_title']
							),
							'description' => $this->format_string(
								$all['og_frontpage_desc']
							),
							'image' => $context
								->get_loader('post')
								->load_deferred(
									absint($all['og_frontpage_image_id'])
								),
						],
					],
				];
			},
		]);

		if (!empty($post_types) && is_array($post_types)) {
			foreach ($post_types as $post_type) {
				$post_type_object = get_post_type_object($post_type);

				if (isset($post_type_object->graphql_single_name)):
					register_graphql_field(
						$post_type_object->graphql_single_name,
						'seo',
						[
							'type' => 'PostTypeSEO',
							'description' => __(
								'The Yoast SEO data of the ' .
								$post_type_object->graphql_single_name,
								'wordpress-seo'
							),
							'resolve' => function (
								$post,
								array $args,
								AppContext $context
							) {
								// Base array
								$seo = [];

								$map = [
									'@id' => 'id',
									'@type' => 'type',
									'@graph' => 'graph',
									'@context' => 'context',
								];

								$schemaArray = YoastSEO()->meta->for_post($post->ID)
									->schema;

								// https://developer.yoast.com/blog/yoast-seo-14-0-using-yoast-seo-surfaces/
								$robots = YoastSEO()->meta->for_post($post->ID)
									->robots;

								// Get data
								$seo = [
									'title' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)->title
									),
									'metaDesc' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->description
									),
									'focuskw' => $this->format_string(
										get_post_meta(
											$post->ID,
											'_yoast_wpseo_focuskw',
											true
										)
									),
									'metaKeywords' => $this->format_string(
										get_post_meta(
											$post->ID,
											'_yoast_wpseo_metakeywords',
											true
										)
									),
									'metaRobotsNoindex' => $robots['index'],
									'metaRobotsNofollow' => $robots['follow'],
									'opengraphTitle' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_title
									),
									'opengraphUrl' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_url
									),
									'opengraphSiteName' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_site_name
									),
									'opengraphType' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_type
									),
									'opengraphAuthor' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_article_author
									),
									'opengraphPublisher' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_article_publisher
									),
									'opengraphPublishedTime' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_article_published_time
									),
									'opengraphModifiedTime' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_article_modified_time
									),
									'opengraphDescription' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->open_graph_description
									),
									'opengraphImage' => function () use (
										$post,
										$context
									) {
										$id = $this->get_og_image(
											YoastSEO()->meta->for_post($post->ID)
												->open_graph_images
										);

										return $context
											->get_loader('post')
											->load_deferred(absint($id));
									},
									'twitterCardType' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->twitter_card
									),
									'twitterTitle' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->twitter_title
									),
									'twitterDescription' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->twitter_description
									),
									'twitterImage' => function () use (
										$post,
										$context
									) {
										$id = $this->wpcom_vip_attachment_url_to_postid(
											YoastSEO()->meta->for_post($post->ID)
												->twitter_image
										);

										return $context
											->get_loader('post')
											->load_deferred(absint($id));
									},
									'canonical' => $this->format_string(
										YoastSEO()->meta->for_post($post->ID)
											->canonical
									),
									'breadcrumbs' => YoastSEO()->meta->for_post(
										$post->ID
									)->breadcrumbs,
									'cornerstone' => boolval(
										YoastSEO()->meta->for_post($post->ID)
											->indexable->is_cornerstone
									),
									'schema' => [
										'pageType' => is_array(
											YoastSEO()->meta->for_post($post->ID)
												->schema_page_type
										)
											? YoastSEO()->meta->for_post($post->ID)
												->schema_page_type
											: [],
										'articleType' => is_array(
											YoastSEO()->meta->for_post($post->ID)
												->schema_article_type
										)
											? YoastSEO()->meta->for_post($post->ID)
												->schema_article_type
											: [],
										'raw' => json_encode(
											$schemaArray,
											JSON_UNESCAPED_SLASHES
										),
									],
								];

								return !empty($seo) ? $seo : null;
							},
						]
					);

					// register field on edge for arch

					$name =
						'WP' .
						ucfirst($post_type_object->graphql_single_name) .
						'Info';

					register_graphql_field($name, 'seo', [
						'type' => 'SEOPostTypePageInfo',
						'description' => __(
							'Raw schema for ' .
							$post_type_object->graphql_single_name,
							'wordpress-seo'
						),
						'resolve' => function (
							$item,
							array $args,
							AppContext $context
						) use ($post_type) {
							$schemaArray = YoastSEO()->meta->for_post_type_archive(
								$post_type
							)->schema;

							return [
								'schema' => [
									'raw' => json_encode(
										$schemaArray,
										JSON_UNESCAPED_SLASHES
									),
								],
							];
						},
					]);

					// Loop each taxonomy to register on the edge if a category is the primary one.
					$taxonomiesPostObj = get_object_taxonomies(
						$post_type,
						'objects'
					);

					$postNameKey = $this->get_field_key(
						$post_type_object->graphql_single_name
					);

					foreach ($taxonomiesPostObj as $tax) {
						if ($tax->hierarchical && $tax->graphql_single_name) {
							$name =
								ucfirst($postNameKey) .
								'To' .
								ucfirst($tax->graphql_single_name) .
								'ConnectionEdge';

							register_graphql_field($name, 'isPrimary', [
								'type' => 'Boolean',
								'description' => __(
									'The Yoast SEO Primary ' . $tax->name,
									'wordpress-seo'
								),
								'resolve' => function (
									$item,
									array $args,
									AppContext $context
								) use ($tax) {
									$postId = $item['source']->ID;

									$wpseo_primary_term = new WPSEO_Primary_Term(
										$tax->name,
										$postId
									);
									$primaryTaxId = $wpseo_primary_term->get_primary_term();
									$termId = $item['node']->term_id;

									return $primaryTaxId === $termId;
								},
							]);
						}
					}
				endif;
			}
		}

		register_graphql_field('User', 'seo', [
			'type' => 'SEOUser',
			'description' => __(
				'The Yoast SEO data of a user',
				'wordpress-seo'
			),
			'resolve' => function ($user, array $args, AppContext $context) {
				$robots = YoastSEO()->meta->for_author($user->userId)->robots;

				$schemaArray = YoastSEO()->meta->for_author($user->userId)->schema;

				$userSeo = [
					'title' => $this->format_string(
						YoastSEO()->meta->for_author($user->userId)->title
					),
					'metaDesc' => $this->format_string(
						YoastSEO()->meta->for_author($user->userId)->description
					),
					'metaRobotsNoindex' => $robots['index'],
					'metaRobotsNofollow' => $robots['follow'],

					'social' => [
						'facebook' => $this->format_string(
							get_the_author_meta('facebook', $user->userId)
						),
						'twitter' => $this->format_string(
							get_the_author_meta('twitter', $user->userId)
						),
						'instagram' => $this->format_string(
							get_the_author_meta('instagram', $user->userId)
						),
						'linkedIn' => $this->format_string(
							get_the_author_meta('linkedin', $user->userId)
						),
						'mySpace' => $this->format_string(
							get_the_author_meta('myspace', $user->userId)
						),
						'pinterest' => $this->format_string(
							get_the_author_meta('pinterest', $user->userId)
						),
						'youTube' => $this->format_string(
							get_the_author_meta('youtube', $user->userId)
						),
						'soundCloud' => $this->format_string(
							get_the_author_meta('soundcloud', $user->userId)
						),
						'wikipedia' => $this->format_string(
							get_the_author_meta('wikipedia', $user->userId)
						),
					],
					'schema' => [
						'raw' => json_encode($schemaArray, JSON_UNESCAPED_SLASHES),
					],
				];

				return !empty($userSeo) ? $userSeo : [];
			},
		]);

		if (!empty($taxonomies) && is_array($taxonomies)) {
			foreach ($taxonomies as $tax) {
				$taxonomy = get_taxonomy($tax);

				if (empty($taxonomy) || !isset($taxonomy->graphql_single_name)) {
					return;
				}

				register_graphql_field($taxonomy->graphql_single_name, 'seo', [
					'type' => 'TaxonomySEO',
					'description' => __(
						'The Yoast SEO data of the ' .
						$taxonomy->label .
						' taxonomy.',
						'wordpress-seo'
					),
					'resolve' => function ($term, array $args, AppContext $context) {
						$term_obj = get_term($term->term_id);

						$meta = WPSEO_Taxonomy_Meta::get_term_meta(
							(int) $term_obj->term_id,
							$term_obj->taxonomy
						);
						$robots = YoastSEO()->meta->for_term($term->term_id)->robots;

						$schemaArray = YoastSEO()->meta->for_term($term->term_id)
							->schema;

						// Get data
						$seo = [
							'title' => $this->format_string(
								html_entity_decode(
									wp_strip_all_tags(
										YoastSEO()->meta->for_term($term->term_id)
											->title
									)
								)
							),
							'metaDesc' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->description
							),
							'focuskw' => $this->format_string(
								$meta['wpseo_focuskw']
							),
							'metaKeywords' => $this->format_string(
								$meta['wpseo_metakeywords']
							),
							'metaRobotsNoindex' => $robots['index'],
							'metaRobotsNofollow' => $robots['follow'],
							'opengraphTitle' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_title
							),
							'opengraphUrl' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_url
							),
							'opengraphSiteName' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_site_name
							),
							'opengraphType' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_type
							),
							'opengraphAuthor' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_article_author
							),
							'opengraphPublisher' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_article_publisher
							),
							'opengraphPublishedTime' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_article_published_time
							),
							'opengraphModifiedTime' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_article_modified_time
							),
							'opengraphDescription' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->open_graph_description
							),
							'opengraphImage' => $context
								->get_loader('post')
								->load_deferred(
									absint($meta['wpseo_opengraph-image-id'])
								),
							'twitterCardType' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->twitter_card
							),
							'twitterTitle' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->twitter_title
							),
							'twitterDescription' => $this->format_string(
								YoastSEO()->meta->for_term($term->term_id)
									->twitter_description
							),
							'twitterImage' => $context
								->get_loader('post')
								->load_deferred(
									absint($meta['wpseo_twitter-image-id'])
								),
							'canonical' => $this->format_string(
								$meta['canonical']
							),
							'breadcrumbs' => YoastSEO()->meta->for_term(
								$term->term_id
							)->breadcrumbs,
							'cornerstone' => boolval(
								YoastSEO()->meta->for_term($term->term_id)
									->is_cornerstone
							),
							'schema' => [
								'raw' => json_encode(
									$schemaArray,
									JSON_UNESCAPED_SLASHES
								),
							],
						];
						wp_reset_query();

						return !empty($seo) ? $seo : null;
					},
				]);
			}
		}
	}

	protected function format_string($string ) {
		return isset($string) ? trim($string) : null;
	}

	protected function get_og_image($images) {
		if (empty($images)) {
			return __return_empty_string();
		}

		$image = reset($images);

		if (empty($image)) {
			return __return_empty_string();
		}

		if (!isset($image['url'])) {
			return __return_empty_string();
		}
		// Remove image sizes from url
		$url = preg_replace(
			'/(.*)-\d+x\d+\.(jpg|png|gif)$/',
			'$1.$2',
			$image['url']
		);
		return $this->wpcom_vip_attachment_url_to_postid($url);
	}

	protected function get_field_key($field_key ) {
		$field_key = lcfirst(preg_replace('[^a-zA-Z0-9 -]', ' ', $field_key));
		$field_key = lcfirst(str_replace('_', ' ', ucwords($field_key, '_')));
		$field_key = lcfirst(str_replace('-', ' ', ucwords($field_key, '_')));
		$field_key = lcfirst(str_replace(' ', '', ucwords($field_key, ' ')));

		return $field_key;
	}

	protected function wpcom_vip_attachment_cache_key($url) {
		return 'wpcom_vip_attachment_url_post_id_' . md5($url);
	}

	protected function wpcom_vip_attachment_url_to_postid($url) {
		$cache_key = $this->wpcom_vip_attachment_cache_key($url);
		$id = \wp_cache_get($cache_key);
		if (false === $id) {
			$id = \attachment_url_to_postid($url); // phpcs:ignore
			if (empty($id)) {
				\wp_cache_set(
					$cache_key,
					'not_found',
					'default',
					12 * HOUR_IN_SECONDS + mt_rand(0, 4 * HOUR_IN_SECONDS) // phpcs:ignore
				);
			} else {
				\wp_cache_set(
					$cache_key,
					$id,
					'default',
					24 * HOUR_IN_SECONDS + mt_rand(0, 12 * HOUR_IN_SECONDS) // phpcs:ignore
				);
			}
		} elseif ('not_found' === $id) {
			return false;
		}

		return $id;
	}

	protected function build_content_types($types) {
		$carry = [];
		foreach ($types as $type) {
			$post_type_object = get_post_type_object($type);
			if ($post_type_object->graphql_single_name) {
				$carry[
				$this->get_field_key($post_type_object->graphql_single_name)
				] = ['type' => 'SEOContentType'];
			}
		}
		return $carry;
	}

	protected function build_content_type_data($types, $all) {
		$carry = [];
		foreach ($types as $type) {
			$post_type_object = get_post_type_object($type);
			if ($post_type_object->graphql_single_name) {
				$tag = $this->get_field_key(
					$post_type_object->graphql_single_name
				);

				$schemaArray = YoastSEO()->meta->for_post_type_archive($type)
					->schema;

				$carry[$tag] = [
					'title' => $all['title-' . $tag],
					'metaDesc' => $all['metadesc-' . $tag],
					'metaRobotsNoindex' => $all['noindex-' . $tag],
					'schemaType' => $all['schema-page-type-' . $tag],
					'schema' => [
						'raw' => json_encode($schemaArray, JSON_UNESCAPED_SLASHES),
					],
				];
			}
		}
		return $carry;
	}
}


