<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Application\Llms_Txt_Status_Updater;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;

/**
 * The llms.txt feature, which generates the llms.txt file.
 */
class Llms_Txt_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'llms_txt';

	/**
	 * The non-multisite conditional.
	 *
	 * @var Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * Constructor.
	 *
	 * @param Non_Multisite_Conditional $non_multisite_conditional The non-multisite conditional.
	 */
	public function __construct( Non_Multisite_Conditional $non_multisite_conditional ) {
		$this->non_multisite_conditional = $non_multisite_conditional;
	}

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return self::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return Llms_Txt_Status_Updater::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'llms.txt';
	}

	/**
	 * Returns whether the feature can be changed on the site: the llms.txt feature cannot be enabled on multisite
	 * installations.
	 *
	 * @return bool Whether the feature can be changed.
	 */
	public function is_available(): bool {
		return $this->non_multisite_conditional->is_met();
	}
}
