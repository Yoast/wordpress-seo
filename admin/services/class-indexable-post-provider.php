<?php


class WPSEO_Indexable_Service_Post_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id ) {


		/*
* object_id: (int) ID of the requested post
object_type: (string) The type of the requested object (post)
object_subtype: (string) The post type of the requested postget_post_type
permalink: (string) The URL the indexable is presented on, on the front-end of the site (get_post_permalink)
canonical: (string) canonical
title: (string) title
description: (string)metadesc
breadcrumb_title: (string) bctitle
og_title: (string) opengraph-title
og_description: (string) opengraph-description
og_image: (string) opengraph-image
twitter_title: (string) twitter-title
twitter_description: (string) twitter-description
twitter_image: (string) twitter-image
is_robots_noindex: (boolean) robots-noindex === 1 -> true, === 2 -> return false, otherwise return null
is_robots_nofollow: (boolean) robots-nofollow
is_robots_noarchive: (boolean) robots-adv contains nofollow
is_robots_noimageindex: (boolean) robots-adv contains noimageindex
is_robots_nosnippet: (boolean) robots-adv contains nosnippet
primary_focus_keyword: (string) focuskw
primary_focus_keyword_score: (int) linkdex
readability_score: (int) content_score
is_cornerstone: (boolean) is_cornerstone (depends on #9289)
link_count: Retrieve internal_link_count from the SEO_Meta table
incoming_link_count: Retrieve incoming_link_count from the SEO_Meta table

*
*/


		return array(
			'object_id'                   => $object_id,
			'object_type'                 => 'post',
			'object_subtype'              => get_post_type( $object_id ),
			'permalink'                   => get_permalink( $object_id ),
			'canonical'                   => WPSEO_Meta::get_value( 'canonical', $object_id ),
			'title'                       => WPSEO_Meta::get_value( 'title', $object_id ),
			'description'                 => WPSEO_Meta::get_value( 'metadesc', $object_id ),
			'breadcrumb_title'            => WPSEO_Meta::get_value( 'bctitle', $object_id ),
			'og_title'                    => WPSEO_Meta::get_value( 'opengraph-title', $object_id ),
			'og_description'              => WPSEO_Meta::get_value( 'opengraph-description', $object_id ),
			'og_image'                    => WPSEO_Meta::get_value( 'opengraph-image', $object_id ),
			'twitter_title'               => WPSEO_Meta::get_value( 'twitter-title', $object_id ),
			'twitter_description'         => WPSEO_Meta::get_value( 'twitter-description', $object_id ),
			'twitter_image'               => WPSEO_Meta::get_value( 'twitter-image', $object_id ),
			'is_robots_noindex'           => WPSEO_Meta::get_value( 'twitter-noindex', $object_id ),
			'is_robots_nofollow'          => WPSEO_Meta::get_value( 'twitter-nofollow', $object_id ),
			'is_robots_noarchive'         => '',
			'is_robots_noimageindex'      => '',
			'is_robots_nosnippet'         => '',
			'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $object_id ),
			'primary_focus_keyword_score' => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'readability_score'           => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'is_cornerstone'              => WPSEO_Meta::get_value( 'content_score', $object_id ) === '1',
			'link_count'                  => '',
			'incoming_link_count'         => '',
			'created_at'                  => null,
			'updated_at'                  => null,
		);
	}

	/**
	 * @param $object_id
	 *
	 * @return bool Whether the obvj
	 */
	public function exists( $object_id ) {
		return get_post( $object_id ) !== null;
	}
}