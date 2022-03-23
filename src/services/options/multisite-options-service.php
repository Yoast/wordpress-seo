<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The multisite site options service class.
 */
class Multisite_Options_Service extends Abstract_Options_Service {

	/**
	 * Holds the multisite' network option configurations.
	 *
	 * {@inheritDoc}
	 *
	 * @var array[string]
	 */
	protected $configurations = [
		'access' => [
			'default'    => 0,
			'sanitizer'  => 'array',
			'validator'  => null,
			'ms_exclude' => false,
		],
	];
}
