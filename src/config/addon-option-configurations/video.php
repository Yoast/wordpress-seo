<?php

class Video_Addon_Option_Configurations extends Addon_Option_Configurations {
    protected $configurations = [
        'video_dbversion'            => 0,
        // Form fields.
        'video_cloak_sitemap'        => false,
        'video_disable_rss'          => false,
        'video_custom_fields'        => '',
        'video_facebook_embed'       => true,
        'video_fitvids'              => false,
        'video_content_width'        => '',
        'video_wistia_domain'        => '',
        'video_embedly_api_key'      => '',
        // Translate & enrich defaults handled here
        'videositemap_posttypes'     => get_post_types( [ 'public' => true ] ),
        'videositemap_taxonomies'    => [],
        'video_youtube_faster_embed' => false,
    ];

    // ...etc.
}