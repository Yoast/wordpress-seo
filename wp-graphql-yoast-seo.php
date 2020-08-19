<?php

/**
 * Plugin Name:     WPGraphql SEO
 * Plugin URI:      https://github.com/ashhitch/wp-graphql-yoast-seo
 * Description:     A WPGraphQL Extension that adds support for Yoast SEO
 * Author:          Ash Hitchcock
 * Author URI:      https://www.ashleyhitchcock.com
 * Text Domain:     wp-graphql-yoast-seo
 * Domain Path:     /languages
 * Version:         4.5.4
 *
 * @package         WP_Graphql_YOAST_SEO
 */
if (!defined('ABSPATH')) {
  exit();
}

use WPGraphQL\AppContext;
use WPGraphQL\Data\DataSource;

add_action('admin_init', function () {
  $core_dependencies = [
    'WPGraphQL plugin' => class_exists('WPGraphQL'),
    'Yoast SEO'        => function_exists('YoastSEO')
  ];

  $missing_dependencies = array_keys(array_diff($core_dependencies, array_filter($core_dependencies)));
  $display_admin_notice = static function () use ($missing_dependencies) {
?>
    <div class="notice notice-error">
      <p><?php esc_html_e('The WPGraphQL Yoast SEO plugin can\'t be loaded because these dependencies are missing:', 'wp-graphql-yoast-seo'); ?></p>
      <ul>
        <?php foreach ($missing_dependencies as $missing_dependency) : ?>
          <li><?php echo esc_html($missing_dependency); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
<?php
  };

  if (!empty($missing_dependencies)) {
    add_action('network_admin_notices', $display_admin_notice);
    add_action('admin_notices', $display_admin_notice);

    return;
  }
});

add_action('graphql_init', function () {
  if (!function_exists('wp_gql_seo_format_string')) {
    function wp_gql_seo_format_string($string)
    {

      return isset($string) ? trim($string) : null;
    }
  }
  if (!function_exists('wp_gql_seo_get_og_image')) {
    function wp_gql_seo_get_og_image($images)
    {

      if (empty($images)) {
        return __return_empty_string();
      }

      $image  = reset($images);

      if (empty($image)) {
        return __return_empty_string();
      }


      if (!isset($image['url'])) {
        return __return_empty_string();
      }

      return attachment_url_to_postid($image['url']);
    }
  }

  add_action('graphql_register_types', function () {
    $post_types = \WPGraphQL::get_allowed_post_types();
    $taxonomies = \WPGraphQL::get_allowed_taxonomies();

    // If WooCommerce installed then add these post types and taxonomies
    if (class_exists('\WooCommerce')) {
      array_push($post_types, 'product');
      array_push($taxonomies, 'productCategory');
    }

    register_graphql_enum_type('SEOCardType', [
      'description' => __('Types of cards', 'wp-graphql-yoast-seo'),
      'values' => [
        'summary_large_image' => [
          'value' => 'summary_large_image'
        ],
        'summary' => [
          'value' => 'summary'
        ],
      ],
    ]);

    register_graphql_object_type('SEO', [
      'fields' => [
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
      ]
    ]);

    register_graphql_object_type('SEOPostTypeBreadcrumbs', [
      'fields' => [
        'url' => ['type' => 'String'],
        'text' => ['type' => 'String'],

      ]
    ]);

    register_graphql_object_type('SEOSchema', [
      'description' => __('The Yoast SEO schema data', 'wp-graphql-yoast-seo'),
      'fields' => [
        'companyName' => ['type' => 'String'],
        'companyOrPerson' => ['type' => 'String'],
        'companyLogo' => ['type' => 'MediaItem'],
        'personLogo' => ['type' => 'MediaItem'],
        'logo' => ['type' => 'MediaItem'],
        'siteName' => ['type' => 'String'],
        'wordpressSiteName' => ['type' => 'String'],
        'siteUrl' => ['type' => 'String'],
        'inLanguage' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOWebmaster', [
      'description' => __('The Yoast SEO  webmaster fields', 'wp-graphql-yoast-seo'),
      'fields' => [
        'baiduVerify' => ['type' => 'String'],
        'googleVerify' => ['type' => 'String'],
        'msVerify' => ['type' => 'String'],
        'yandexVerify' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOBreadcrumbs', [
      'description' => __('The Yoast SEO breadcrumb config', 'wp-graphql-yoast-seo'),
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
      ]
    ]);

    register_graphql_object_type('SEOSocialFacebook', [
      'fields' => [
        'url' => ['type' => 'String'],
        'defaultImage' => ['type' => 'MediaItem'],
      ]
    ]);

    register_graphql_object_type('SEOSocialTwitter', [
      'fields' => [
        'username' => ['type' => 'String'],
        'cardType' => ['type' => 'SEOCardType'],
      ]
    ]);

    register_graphql_object_type('SEOSocialInstagram', [
      'fields' => [
        'url' => ['type' => 'String'],
      ]
    ]);
    register_graphql_object_type('SEOSocialLinkedIn', [
      'fields' => [
        'url' => ['type' => 'String'],
      ]
    ]);
    register_graphql_object_type('SEOSocialMySpace', [
      'fields' => [
        'url' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOSocialPinterest', [
      'fields' => [
        'url' => ['type' => 'String'],
        'metaTag' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOSocialYoutube', [
      'fields' => [
        'url' => ['type' => 'String'],
      ]
    ]);
    register_graphql_object_type('SEOSocialWikipedia', [
      'fields' => [
        'url' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOSocial', [
      'description' => __('The Yoast SEO Social media links', 'wp-graphql-yoast-seo'),
      'fields' => [
        'facebook' => ['type' => 'SEOSocialFacebook'],
        'twitter' => ['type' => 'SEOSocialTwitter'],
        'instagram' => ['type' => 'SEOSocialInstagram'],
        'linkedIn' => ['type' => 'SEOSocialLinkedIn'],
        'mySpace' => ['type' => 'SEOSocialMySpace'],
        'pinterest' => ['type' => 'SEOSocialPinterest'],
        'youTube' => ['type' => 'SEOSocialYoutube'],
        'wikipedia' => ['type' => 'SEOSocialWikipedia'],
      ]
    ]);

    register_graphql_object_type('SEORedirect', [
      'description' => __('The Yoast redirect data  (Yoast Premium only)', 'wp-graphql-yoast-seo'),
      'fields' => [
        'origin' => ['type' => 'String'],
        'target' => ['type' => 'String'],
        'type' => ['type' => 'Int'],
        'format' => ['type' => 'String'],

      ]
    ]);

    register_graphql_object_type('SEOOpenGraphFrontPage', [
      'description' => __('The Open Graph Front page data', 'wp-graphql-yoast-seo'),
      'fields' => [
        'title' => ['type' => 'String'],
        'description' => ['type' => 'String'],
        'image' => ['type' => 'MediaItem'],
      ]
    ]);

    register_graphql_object_type('SEOOpenGraph', [
      'description' => __('The Open Graph data', 'wp-graphql-yoast-seo'),
      'fields' => [
        'defaultImage' => ['type' => 'MediaItem'],
        'frontPage' => ['type' => 'SEOOpenGraphFrontPage'],
      ]
    ]);

    register_graphql_object_type('SEOConfig', [
      'description' => __('The Yoast SEO site level configuration data', 'wp-graphql-yoast-seo'),
      'fields' => [
        'schema' => ['type' => 'SEOSchema'],
        'webmaster' => ['type' => 'SEOWebmaster'],
        'social' => ['type' => 'SEOSocial'],
        'breadcrumbs' => ['type' => 'SEOBreadcrumbs'],
        'redirects' => ['type' => [
          'list_of' => 'SEORedirect',
        ]],
        'openGraph' => ['type' => 'SEOOpenGraph'],
      ]
    ]);

    register_graphql_object_type('SEOUserSocial', [
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
      ]
    ]);

    register_graphql_object_type('SEOUser', [
      'fields' => [
        'title' => ['type' => 'String'],
        'metaDesc' => ['type' => 'String'],
        'metaRobotsNoindex' => ['type' => 'String'],
        'metaRobotsNofollow' => ['type' => 'String'],
        'social' => ['type' => 'SEOUserSocial'],
      ]
    ]);

    register_graphql_field('RootQuery', 'seo', [
      'type' => 'SEOConfig',
      'description' => __('Returns seo site data', 'wp-graphql-yoast-seo'),
      'resolve' => function ($source, array $args, AppContext $context) {

        $wpseo_options = WPSEO_Options::get_instance();
        $all =  $wpseo_options->get_all();

        $redirectsObj = class_exists('WPSEO_Redirect_Option') ? new WPSEO_Redirect_Option() : false;
        $redirects = $redirectsObj ? $redirectsObj->get_from_option() : [];


        $mappedRedirects = function ($value) {

          return array(
            'origin' => $value['origin'],
            'target' => $value['url'],
            'type' => $value['type'],
            'format' => $value['format'],
          );
        };


        return  array(
          'webmaster' => array(
            'baiduVerify' => wp_gql_seo_format_string($all['baiduverify']),
            'googleVerify' => wp_gql_seo_format_string($all['googleverify']),
            'msVerify' => wp_gql_seo_format_string($all['msverify']),
            'yandexVerify' => wp_gql_seo_format_string($all['yandexverify']),
          ),
          'social' => array(
            'facebook' => array(
              'url' =>  wp_gql_seo_format_string($all['facebook_site']),
              'defaultImage' => DataSource::resolve_post_object($all['og_default_image_id'], $context)
            ),
            'twitter' => array(
              'username' => wp_gql_seo_format_string($all['twitter_site']),
              'cardType' => wp_gql_seo_format_string($all['twitter_card_type']),
            ),
            'instagram' => array('url' => wp_gql_seo_format_string($all['instagram_url'])),
            'linkedIn' => array('url' => wp_gql_seo_format_string($all['linkedin_url'])),
            'mySpace' => array('url' => wp_gql_seo_format_string($all['myspace_url'])),
            'pinterest' => array(
              'url' => wp_gql_seo_format_string($all['pinterest_url']),
              'metaTag' => wp_gql_seo_format_string($all['pinterestverify']),
            ),
            'youTube' => array('url' => wp_gql_seo_format_string($all['youtube_url'])),
            'wikipedia' => array('url' => wp_gql_seo_format_string($all['wikipedia_url'])),
          ),
          'breadcrumbs' => array(
            'enabled' =>  wp_gql_seo_format_string($all['breadcrumbs-enable']),
            'boldLast' =>  wp_gql_seo_format_string($all['breadcrumbs-boldlast']),
            'showBlogPage' =>  wp_gql_seo_format_string($all['breadcrumbs-display-blog-page']),
            'archivePrefix' =>  wp_gql_seo_format_string($all['breadcrumbs-archiveprefix']),
            'prefix' =>  wp_gql_seo_format_string($all['breadcrumbs-prefix']),
            'notFoundText' =>  wp_gql_seo_format_string($all['breadcrumbs-404crumb']),
            'homeText' =>  wp_gql_seo_format_string($all['breadcrumbs-home']),
            'searchPrefix' =>  wp_gql_seo_format_string($all['breadcrumbs-searchprefix']),
            'separator' =>  wp_gql_seo_format_string($all['breadcrumbs-sep']),
          ),
          'schema' => array(
            'companyName' => wp_gql_seo_format_string($all['company_name']),
            'companyLogo' => DataSource::resolve_post_object($all['company_logo_id'], $context),
            'personLogo' => DataSource::resolve_post_object($all['person_logo_id'], $context),
            'logo' => DataSource::resolve_post_object($all['company_or_person'] === 'company' ? $all['company_logo_id'] : $all['person_logo_id'], $context),
            'companyOrPerson' => wp_gql_seo_format_string($all['company_or_person']),
            'siteName' => wp_gql_seo_format_string(YoastSEO()->helpers->site->get_site_name()),
            'wordpressSiteName' => wp_gql_seo_format_string(get_bloginfo('name')),
            'siteUrl' => wp_gql_seo_format_string(get_site_url()),
            'inLanguage' => wp_gql_seo_format_string(get_bloginfo('language')),
          ),
          'redirects' => array_map($mappedRedirects, $redirects),
          'openGraph' => array(
            'defaultImage' =>  DataSource::resolve_post_object($all['og_default_image_id'], $context),
            'frontPage' => array(
              'title' => wp_gql_seo_format_string($all['og_frontpage_title']),
              'description' => wp_gql_seo_format_string($all['og_frontpage_desc']),
              'image' => DataSource::resolve_post_object($all['og_frontpage_image_id'], $context),
            )
          )
        );
      },
    ]);

    if (!empty($post_types) && is_array($post_types)) {
      foreach ($post_types as $post_type) {
        $post_type_object = get_post_type_object($post_type);

        if (isset($post_type_object->graphql_single_name)) :
          register_graphql_field($post_type_object->graphql_single_name, 'seo', [
            'type' => 'SEO',
            'description' => __('The Yoast SEO data of the ' . $post_type_object->graphql_single_name, 'wp-graphql-yoast-seo'),
            'resolve' => function ($post, array $args, AppContext $context) {

              // Base array
              $seo = array();

              // https://developer.yoast.com/blog/yoast-seo-14-0-using-yoast-seo-surfaces/
              $robots = YoastSEO()->meta->for_post($post->ID)->robots;
              // Get data
              $seo = array(
                'title' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->title),
                'metaDesc' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->description),
                'focuskw' => wp_gql_seo_format_string(get_post_meta($post->ID, '_yoast_wpseo_focuskw', true)),
                'metaKeywords' => wp_gql_seo_format_string(get_post_meta($post->ID, '_yoast_wpseo_metakeywords', true)),
                'metaRobotsNoindex' => $robots['index'],
                'metaRobotsNofollow' => $robots['follow'],
                'opengraphTitle' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_title),
                'opengraphUrl' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_url),
                'opengraphSiteName' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_site_name),
                'opengraphType' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_type),
                'opengraphAuthor' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_article_author),
                'opengraphPublisher' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_article_publisher),
                'opengraphPublishedTime' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_article_published_time),
                'opengraphModifiedTime' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_article_modified_time),
                'opengraphDescription' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->open_graph_description),
                'opengraphImage' => DataSource::resolve_post_object(wp_gql_seo_get_og_image(YoastSEO()->meta->for_post($post->ID)->open_graph_images), $context),
                'twitterCardType' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->twitter_card),
                'twitterTitle' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->twitter_title),
                'twitterDescription' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->twitter_description),
                'twitterImage' => DataSource::resolve_post_object(attachment_url_to_postid(YoastSEO()->meta->for_post($post->ID)->twitter_image), $context),
                'canonical' => wp_gql_seo_format_string(YoastSEO()->meta->for_post($post->ID)->canonical),
                'breadcrumbs' => YoastSEO()->meta->for_post($post->ID)->breadcrumbs
              );

              return !empty($seo) ? $seo : null;
            }
          ]);
        endif;
      }
    }

    register_graphql_field('User', 'seo',  [
      'type'        => 'SEOUser',
      'description' => __('The Yoast SEO data of a user', 'wp-graphql-yoast-seo'),
      'resolve'     => function ($user, array $args, AppContext $context) {

        $robots =  YoastSEO()->meta->for_author($user->userId)->robots;

        $userSeo = array(
          'title' => wp_gql_seo_format_string(YoastSEO()->meta->for_author($user->userId)->title),
          'metaDesc' => wp_gql_seo_format_string(YoastSEO()->meta->for_author($user->userId)->description),
          'metaRobotsNoindex' => $robots['index'],
          'metaRobotsNofollow' => $robots['follow'],

          'social' => array(
            'facebook' => wp_gql_seo_format_string(get_the_author_meta('facebook', $user->userId)),
            'twitter' => wp_gql_seo_format_string(get_the_author_meta('twitter', $user->userId)),
            'instagram' => wp_gql_seo_format_string(get_the_author_meta('instagram', $user->userId)),
            'linkedIn' => wp_gql_seo_format_string(get_the_author_meta('linkedin', $user->userId)),
            'mySpace' => wp_gql_seo_format_string(get_the_author_meta('myspace', $user->userId)),
            'pinterest' => wp_gql_seo_format_string(get_the_author_meta('pinterest', $user->userId)),
            'youTube' => wp_gql_seo_format_string(get_the_author_meta('youtube', $user->userId)),
            'soundCloud' => wp_gql_seo_format_string(get_the_author_meta('soundcloud', $user->userId)),
            'wikipedia' => wp_gql_seo_format_string(get_the_author_meta('wikipedia', $user->userId)),
          ),
        );

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
          'type' => 'SEO',
          'description' => __('The Yoast SEO data of the ' . $taxonomy->label . ' taxonomy.', 'wp-graphql-yoast-seo'),
          'resolve' => function ($term, array $args, AppContext $context) {

            $term_obj = get_term($term->term_id);

            $meta =  WPSEO_Taxonomy_Meta::get_term_meta((int) $term_obj->term_id, $term_obj->taxonomy);
            $robots = YoastSEO()->meta->for_term($term->term_id)->robots;

            // Get data
            $seo = array(
              'title' => wp_gql_seo_format_string(html_entity_decode(strip_tags(YoastSEO()->meta->for_term($term->term_id)->title))),
              'metaDesc' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->description),
              'focuskw' => wp_gql_seo_format_string($meta['wpseo_focuskw']),
              'metaKeywords' => wp_gql_seo_format_string($meta['wpseo_metakeywords']),
              'metaRobotsNoindex' => $robots['index'],
              'metaRobotsNofollow' => $robots['follow'],
              'opengraphTitle' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_title),
              'opengraphUrl' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_url),
              'opengraphSiteName' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_site_name),
              'opengraphType' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_type),
              'opengraphAuthor' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_author),
              'opengraphPublisher' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_publisher),
              'opengraphPublishedTime' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_published_time),
              'opengraphModifiedTime' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_modified_time),
              'opengraphDescription' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->open_graph_description),
              'opengraphImage' => DataSource::resolve_post_object($meta['wpseo_opengraph-image-id'], $context),
              'twitterCardType' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->twitter_card),
              'twitterTitle' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->twitter_title),
              'twitterDescription' => wp_gql_seo_format_string(YoastSEO()->meta->for_term($term->term_id)->twitter_description),
              'twitterImage' => DataSource::resolve_post_object($meta['wpseo_twitter-image-id'], $context),
              'canonical' => wp_gql_seo_format_string($meta['canonical']),
              'breadcrumbs' => YoastSEO()->meta->for_term($term->term_id)->breadcrumbs
            );
            wp_reset_query();

            return !empty($seo) ? $seo : null;
          }
        ]);
      }
    }
  });
});
