<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

/**
 * The Open Graph data feature, which outputs the Open Graph meta tags.
 */
class Open_Graph_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'open_graph';

	/**
	 * The name of the boolean option that enables the feature.
	 *
	 * @var string
	 */
	public const OPTION_NAME = 'opengraph';

	/**
	 * The human-readable name of the feature.
	 *
	 * @var string
	 */
	public const NAME = 'Open Graph data';
}
