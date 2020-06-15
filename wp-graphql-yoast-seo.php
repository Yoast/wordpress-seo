<?php

/**
 * Plugin Name:     WPGraphql Yoast Seo
 * Plugin URI:      https://github.com/ashhitch/wp-graphql-yoast-seo
 * Description:     A WPGraphQL Extension that adds support for Yoast SEO
 * Author:          Ash Hitchcock
 * Author URI:      https://www.ashleyhitchcock.com
 * Text Domain:     wp-graphql-yoast-seo
 * Domain Path:     /languages
 * Version:         4.2.0
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
    'Yoast SEO'        => is_plugin_active('wordpress-seo/wp-seo.php') || is_plugin_active('wordpress-seo-premium/wp-seo-premium.php')
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
  if (!function_exists('get_og_image')) {
    function get_og_image($images)
    {

      if (empty($images)) {
        __return_empty_string();
      }

      $image  = reset($images);

      if (empty($image)) {
        __return_empty_string();
      }


      if (!isset($image['url'])) {
        __return_empty_string();
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
      'fields' => [
        'companyName' => ['type' => 'String'],
        'companyOrPerson' => ['type' => 'String'],
        'companyLogo' => ['type' => 'MediaItem'],
        'personLogo' => ['type' => 'MediaItem'],
        'logo' => ['type' => 'MediaItem'],
        'siteName' => ['type' => 'String'],
        'wordpressSiteName' => ['type' => 'String'],
        'siteUrl' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOWebmaster', [
      'fields' => [
        'baiduVerify' => ['type' => 'String'],
        'googleVerify' => ['type' => 'String'],
        'msVerify' => ['type' => 'String'],
        'yandexVerify' => ['type' => 'String'],
      ]
    ]);

    register_graphql_object_type('SEOBreadcrumbs', [
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

    register_graphql_object_type('SEOConfig', [
      'description' => __('The Yoast SEO site level configuration data', 'wp-graphql-yoast-seo'),
      'fields' => [
        'schema' => ['type' => 'SEOSchema'],
        'webmaster' => ['type' => 'SEOWebmaster'],
        'social' => ['type' => 'SEOSocial'],
        'breadcrumbs' => ['type' => 'SEOBreadcrumbs'],
      ]
    ]);

    register_graphql_field('RootQuery', 'seo', [
      'type' => 'SEOConfig',
      'description' => __('Returns seo site data', 'wp-graphql-yoast-seo'),
      'resolve' => function ($source, array $args, AppContext $context) {

        $wpseo_options = WPSEO_Options::get_instance();
        $all =  $wpseo_options->get_all();

        return  array(
          'webmaster' => array(
            'baiduVerify' => trim($all['baiduverify']),
            'googleVerify' => trim($all['googleverify']),
            'msVerify' => trim($all['msverify']),
            'yandexVerify' => trim($all['yandexverify']),
          ),
          'social' => array(
            'facebook' => array(
              'url' =>  trim($all['facebook_site']),
              'defaultImage' => DataSource::resolve_post_object($all['og_default_image_id'], $context)
            ),
            'twitter' => array(
              'username' => trim($all['twitter_site']),
              'cardType' => trim($all['twitter_card_type']),
            ),
            'instagram' => array('url' => trim($all['instagram_url'])),
            'linkedIn' => array('url' => trim($all['linkedin_url'])),
            'mySpace' => array('url' => trim($all['myspace_url'])),
            'pinterest' => array(
              'url' => trim($all['pinterest_url']),
              'metaTag' => trim($all['pinterestverify']),
            ),
            'youTube' => array('url' => trim($all['youtube_url'])),
            'wikipedia' => array('url' => trim($all['wikipedia_url'])),
          ),
          'breadcrumbs' => array(
            'enabled' =>  trim($all['breadcrumbs-enable']),
            'boldLast' =>  trim($all['breadcrumbs-boldlast']),
            'showBlogPage' =>  trim($all['breadcrumbs-display-blog-page']),
            'archivePrefix' =>  trim($all['breadcrumbs-archiveprefix']),
            'prefix' =>  trim($all['breadcrumbs-prefix']),
            'notFoundText' =>  trim($all['breadcrumbs-404crumb']),
            'homeText' =>  trim($all['breadcrumbs-home']),
            'searchPrefix' =>  trim($all['breadcrumbs-searchprefix']),
            'separator' =>  trim($all['breadcrumbs-sep']),
          ),
          'schema' => array(
            'companyName' => trim($all['company_name']),
            'companyLogo' => DataSource::resolve_post_object($all['company_logo_id'], $context),
            'personLogo' => DataSource::resolve_post_object($all['person_logo_id'], $context),
            'logo' => DataSource::resolve_post_object($all['company_or_person'] === 'company' ? $all['company_logo_id'] : $all['person_logo_id'], $context),
            'companyOrPerson' => trim($all['company_or_person']),
            'siteName' => trim(YoastSEO()->helpers->site->get_site_name()),
            'wordpressSiteName' => trim(get_bloginfo('name')),
            'siteUrl' => trim(get_site_url()),
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
                'title' => trim(YoastSEO()->meta->for_post($post->ID)->title),
                'metaDesc' => trim(YoastSEO()->meta->for_post($post->ID)->description),
                'focuskw' => trim(get_post_meta($post->ID, '_yoast_wpseo_focuskw', true)),
                'metaKeywords' => trim(get_post_meta($post->ID, '_yoast_wpseo_metakeywords', true)),
                'metaRobotsNoindex' => $robots['index'],
                'metaRobotsNofollow' => $robots['follow'],
                'opengraphTitle' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_title),
                'opengraphUrl' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_url),
                'opengraphSiteName' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_site_name),
                'opengraphType' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_type),
                'opengraphAuthor' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_article_author),
                'opengraphPublisher' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_article_publisher),
                'opengraphPublishedTime' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_article_published_time),
                'opengraphModifiedTime' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_article_modified_time),
                'opengraphDescription' => trim(YoastSEO()->meta->for_post($post->ID)->open_graph_description),
                'opengraphImage' => DataSource::resolve_post_object(get_og_image(YoastSEO()->meta->for_post($post->ID)->open_graph_images), $context),
                'twitterCardType' => trim(YoastSEO()->meta->for_post($post->ID)->twitter_card),
                'twitterTitle' => trim(YoastSEO()->meta->for_post($post->ID)->twitter_title),
                'twitterDescription' => trim(YoastSEO()->meta->for_post($post->ID)->twitter_description),
                'twitterImage' => DataSource::resolve_post_object(attachment_url_to_postid(YoastSEO()->meta->for_post($post->ID)->twitter_image), $context),
                'canonical' => trim(YoastSEO()->meta->for_post($post->ID)->canonical),
                'breadcrumbs' => YoastSEO()->meta->for_post($post->ID)->breadcrumbs
              );

              return !empty($seo) ? $seo : null;
            }
          ]);
        endif;
      }
    }

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
              'title' => trim(YoastSEO()->meta->for_term($term->term_id)->title),
              'metaDesc' => trim(YoastSEO()->meta->for_term($term->term_id)->description),
              'focuskw' => trim($meta['wpseo_focuskw']),
              'metaKeywords' => trim($meta['wpseo_metakeywords']),
              'metaRobotsNoindex' => $robots['index'],
              'metaRobotsNofollow' => $robots['follow'],
              'opengraphTitle' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_title),
              'opengraphUrl' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_url),
              'opengraphSiteName' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_site_name),
              'opengraphType' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_type),
              'opengraphAuthor' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_author),
              'opengraphPublisher' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_publisher),
              'opengraphPublishedTime' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_published_time),
              'opengraphModifiedTime' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_article_modified_time),
              'opengraphDescription' => trim(YoastSEO()->meta->for_term($term->term_id)->open_graph_description),
              'opengraphImage' => DataSource::resolve_post_object($meta['wpseo_opengraph-image-id'], $context),
              'twitterCardType' => trim(YoastSEO()->meta->for_term($term->term_id)->twitter_card),
              'twitterTitle' => trim(YoastSEO()->meta->for_term($term->term_id)->twitter_title),
              'twitterDescription' => trim(YoastSEO()->meta->for_term($term->term_id)->twitter_description),
              'twitterImage' => DataSource::resolve_post_object($meta['wpseo_twitter-image-id'], $context),
              'canonical' => trim($meta['canonical']),
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
