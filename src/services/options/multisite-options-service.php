<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The multisite site options service class.
 */
class Multisite_Options_Service extends Abstract_Options_Service {

	/**
	 * The options.
	 *
	 * @var array
	 */
	protected $options = [
		'access' => [
			'default'    => 0,
			'sanitizer'  => 'array',
			'validator'  => null,
			'ms_exclude' => false,
		],
	];
}
