<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The single site options service class.
 */
class Site_Options_Service extends Abstract_Options_Service {

	/**
	 * Holds the site option configurations.
	 *
	 * @var array
	 */
	protected $options = [
		'activation_redirect_timestamp_free' => [
			'default'     => 0,
			'sanitize_as' => 'integer',
			'validate_as' => null,
			'ms_exclude'  => false,
		],
		'algolia_integration_active'         => [
			'default'     => false,
			'sanitize_as' => 'boolean',
			'validate_as' => null,
			'ms_exclude'  => false,
		],
		'baiduverify'                        => [
			'default'     => '',
			'sanitize_as' => 'text',
			'validate_as' => null,
			'ms_exclude'  => false,
		],
		'indexing_reason'                    => [
			'default'     => '',
			'sanitize_as' => 'text',
			'validate_as' => null,
			'ms_exclude'  => false,
		],
	];
}
