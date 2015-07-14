<?php

/**
 * @package WPSEO\Admin\Customizer
 */

/**
 * class WPSEO_Customizer
 *
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 */
class WPSEO_Customizer {



/**
* Construct Method.
*/
function __construct() {
	add_action('customize_register', array(&$this, 'wpseo_customize_register'));
}

/**
* Function to support WordPress Customizer
*/
function wpseo_customize_register( $wp_customize )
{

    // WordPress SEO Panel
    $wp_customize->add_panel(
        'wpseo_panel', array(
            'priority' => '999',
            'capability' => 'edit_theme_options',
            'theme_supports' => '',
            'title' => __('WordPress SEO', 'wordpress-seo'),
            'description' => __('Customize your WordPress SEO Settings.', 'wordpress-seo'),
         )
    );


    // Breadcrumbs Section
    $wp_customize->add_section(
        'wpseo_breadcrumbs_customizer_section', array(
            'title'      => __('Breadcrumbs', 'wordpress-seo'),
            'description' => __('Use this section to enable and customize breadcrumbs for your theme.', 'wordpress-seo'),
            'priority'   => 30,
            'theme_supports' => '', // we may want to set yoast_breadcrumbs
            'panel' => 'wpseo_panel',
         )
    );


    // Social Section
    $wp_customize->add_section(
        'wpseo_social_customizer_section', array(
            'title'      => __('Social Profiles', 'wordpress-seo'),
            'description' => __('Use this section to setup your social profiles with WordPress SEO.', 'wordpress-seo'),
            'priority'   => 30,
            'panel' => 'wpseo_panel',
         )
    );


    // Enable or Disable Breadcrumbs Settings
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-enable]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );


    // Enable or Disable Breadcrumbs Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-enable', array(
                'label'        => __('Enable Breadcrumbs', 'wordpress-seo'),
                'description'  => __('Use this to enable breadcrumbs for your site.', 'wordpress-seo'),
                'type'         => 'checkbox',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-enable]',
                'context'      => ''
             )
         )
    );


    // Bold Last Breadcrumb Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-boldlast]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Bold Last BreadcrumbControls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-boldlast', array(
                'label'        => __('Bold the last page in the breadcrumb', 'wordpress-seo'),
                'description'  => __('Use this to bold the last breadcrumb.', 'wordpress-seo'),
                'type'         => 'checkbox',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-boldlast]',
                'context'      => ''
             )
         )
    );


    // Remove Blog Breadcrumb Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-blog-remove]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );


    // Remove Blog Breadcrumb Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-blog-remove', array(
                'label'        => __('Remove Blog page from Breadcrumbs', 'wordpress-seo'),
                'description'  => __('Use this to remove blog from breadcrumbs.', 'wordpress-seo'),
                'type'         => 'checkbox',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-blog-remove]',
                'context'      => ''
             )
         )
    );



    // Breadcrumb Separator Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-sep]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb Separator Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-separator', array(
                'label'        => __('Breadcrumbs Separator:', 'wordpress-seo'),
                'description'  => __('Use this to set a separator between breadcrumb links.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-sep]',
                'context'      => ''
             )
         )
    );


    // Breadcrumb Anchor Text Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-home]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb Anchor Text Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-home', array(
                'label'        => __('Anchor Text for Homepage:', 'wordpress-seo'),
                'description'  => __('Set the anchor text to represent your homepage.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-home]',
                'context'      => ''
             )
         )
    );


    // Breadcrumb Prefix for Path Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-prefix]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb Prefix for Path Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-prefix', array(
                'label'        => __('Prefix for the breadcrumb path:', 'wordpress-seo'),
                'description'  => __('Set the prefix to be displayed before breadcrumbs.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-prefix]',
                'context'      => ''
             )
         )
    );


    // Breadcrumb Archive Prefix Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-archiveprefix]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb Archive Prefix Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-archiveprefix', array(
                'label'        => __('Prefix for Archive breadcrumbs:', 'wordpress-seo'),
                'description'  => __('Set the prefix text to be used for archives.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-archiveprefix]',
                'context'      => ''
             )
         )
    );

    // Breadcrumb Search Prefix Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-searchprefix]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb Search Prefix Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-searchprefix', array(
                'label'        => __('Prefix for Search Page breadcrumbs:', 'wordpress-seo'),
                'description'  => __('Set the prefix text to be used for your search page.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-searchprefix]',
                'context'      => ''
             )
         )
    );

    // Breadcrumb 404 Prefix Setting
    $wp_customize->add_setting(
        'wpseo_internallinks[breadcrumbs-404crumb]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Breadcrumb 404 Prefix Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-breadcrumbs-404crumb', array(
                'label'        => __('Breadcrumb for 404 Page:', 'wordpress-seo'),
                'description'  => __('Set the breadcrumbs for the 404 page.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_breadcrumbs_customizer_section',
                'settings'     => 'wpseo_internallinks[breadcrumbs-404crumb]',
                'context'      => ''
             )
         )
    );


    // Facebook Site Setting
    $wp_customize->add_setting(
        'wpseo_social[facebook_site]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Facebook Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-facebook-site', array(
                'label'        => __('Facebook Page URL:', 'wordpress-seo'),
                'description'  => __('Please provide your facebook page url.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[facebook_site]',
                'context'      => ''
             )
         )
    );

    // Twitter Site Setting
    $wp_customize->add_setting(
        'wpseo_social[twitter_site]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Twitter Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-twitter-site', array(
                'label'        => __('Twitter Username:', 'wordpress-seo'),
                'description'  => __('Please provide your twitter username (no @ sign).', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[twitter_site]',
                'context'      => ''
             )
         )
    );

    // Instagram Site Setting
    $wp_customize->add_setting(
        'wpseo_social[instagram_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Twitter Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-instagram-url', array(
                'label'        => __('Instagram URL:', 'wordpress-seo'),
                'description'  => __('Please provide your instagram url.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[instagram_url]',
                'context'      => ''
             )
         )
    );


    // LinkedIn Site Setting
    $wp_customize->add_setting(
        'wpseo_social[linkedin_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // LinkedIn Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-linkedin-url', array(
                'label'        => __('LinkedIn URL:', 'wordpress-seo'),
                'description'  => __('Please provide your LinkedIn url.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[linkedin_url]',
                'context'      => ''
             )
         )
    );


    // MySpace Site Setting
    $wp_customize->add_setting(
        'wpseo_social[myspace_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // MySpace Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-myspace-url', array(
                'label'        => __('MySpace URL:', 'wordpress-seo'),
                'description'  => __('Please provide your MySpace URL.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[myspace_url]',
                'context'      => ''
             )
         )
    );


    // Pinterest Site Setting
    $wp_customize->add_setting(
        'wpseo_social[pinterest_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Pinterest Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-myspace-url', array(
                'label'        => __('MySpace URL:', 'wordpress-seo'),
                'description'  => __('Please provide your MySpace URL.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[pinterest_url]',
                'context'      => ''
             )
         )
    );

    // YouTube Site Setting
    $wp_customize->add_setting(
        'wpseo_social[youtube_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // YouTube Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-youtube-url', array(
                'label'        => __('YouTube URL:', 'wordpress-seo'),
                'description'  => __('Please provide your YouTube URL.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[youtube_url]',
                'context'      => ''
             )
         )
    );

    // Google+ Site Setting
    $wp_customize->add_setting(
        'wpseo_social[google_plus_url]', array(
            'default'     => '',
            'type' => 'option',
            'transport'   => 'refresh',
         )
    );

    // Google+ Site Controls
    $wp_customize->add_control(
        new WP_Customize_Control(
            $wp_customize, 'wpseo-googleplus-url', array(
                'label'        => __('Google Plus URL:', 'wordpress-seo'),
                'description'  => __('Please provide your Google Plus URL.', 'wordpress-seo'),
                'type'         => 'text',
                'section'      => 'wpseo_social_customizer_section',
                'settings'     => 'wpseo_social[google_plus_url]',
                'context'      => ''
             )
         )
    );


}

}
