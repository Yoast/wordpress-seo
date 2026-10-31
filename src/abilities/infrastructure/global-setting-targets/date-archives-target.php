<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The date archives, which share one template.
 */
class Date_Archives_Target extends Abstract_Global_Setting_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'date_archives';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns that the date archives share one template.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}

	/**
	 * Returns whether the date archives are enabled.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		return ! $this->options_helper->get( 'disable-date', false );
	}
}
