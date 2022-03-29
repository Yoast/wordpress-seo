<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The taxonomy metadata service class.
 */
class Taxonomy_Metadata_Service extends Abstract_Options_Service {

	/**
	 * Holds the WordPress options' option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_taxonomy_metadata';

	/**
	 * The option configurations.
	 *
	 * @var array
	 */
	protected $configurations = [
		'wpseo_bctitle'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_canonical'             => [
			'default' => '',
			'types'   => [ 'empty_string', 'url' ],
		],
		'wpseo_content_score'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_desc'                  => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_focuskeywords'         => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_focuskw'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_is_cornerstone'        => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_keywordsynonyms'       => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_linkdex'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_noindex'               => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_opengraph-description' => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-image'       => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-image-id'    => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-title'       => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_title'                 => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-description'   => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-image'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-image-id'      => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-title'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
	];
}
