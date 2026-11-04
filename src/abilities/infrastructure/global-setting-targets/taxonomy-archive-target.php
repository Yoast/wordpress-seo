<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use WP_Taxonomy;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * The archives of the terms of a taxonomy, identified by the taxonomy, which fall back to its default SEO settings.
 *
 * Created per taxonomy by the Taxonomy_Archive_Target_Factory, so it is never injected by itself.
 */
class Taxonomy_Archive_Target implements Global_Setting_Target_Interface {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'taxonomy_archive';

	/**
	 * The taxonomy.
	 *
	 * @var string
	 */
	private $taxonomy;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Whether the taxonomy is already known to have default SEO settings.
	 *
	 * @var bool
	 */
	private $is_known_taxonomy;

	/**
	 * Constructor.
	 *
	 * @param string          $taxonomy          The taxonomy.
	 * @param Taxonomy_Helper $taxonomy_helper   The taxonomy helper.
	 * @param Options_Helper  $options_helper    The options helper.
	 * @param bool            $is_known_taxonomy Whether the taxonomy is already known to have default SEO settings,
	 *                                           so it is not looked up again.
	 */
	public function __construct( string $taxonomy, Taxonomy_Helper $taxonomy_helper, Options_Helper $options_helper, bool $is_known_taxonomy = false ) {
		$this->taxonomy          = $taxonomy;
		$this->taxonomy_helper   = $taxonomy_helper;
		$this->options_helper    = $options_helper;
		$this->is_known_taxonomy = $is_known_taxonomy;
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
	 * Returns the name of the target, the taxonomy and its name, which is "Format archives" for the post formats, like
	 * on the settings page.
	 *
	 * @return array<string, string> The identifiers, keyed by input name.
	 */
	public function get_identifiers(): array {
		if ( $this->taxonomy === 'post_format' ) {
			$label = \__( 'Format archives', 'wordpress-seo' );
		}
		else {
			$taxonomy_object = \get_taxonomy( $this->taxonomy );
			$label           = ( $taxonomy_object instanceof WP_Taxonomy ) ? $taxonomy_object->label : $this->taxonomy;
		}

		return [
			'target'   => self::NAME,
			'taxonomy' => $this->taxonomy,
			'label'    => $label,
		];
	}

	/**
	 * Fills the taxonomy into the option pattern, as each taxonomy has its own options.
	 *
	 * @param string $option_pattern The option pattern, like `title-tax-%s`.
	 *
	 * @return string The option name.
	 */
	public function format_option_name( string $option_pattern ): string {
		return \sprintf( $option_pattern, $this->taxonomy );
	}

	/**
	 * Returns that the default SEO settings are shared by the archives of all terms of the taxonomy.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}

	/**
	 * Returns whether the archives of the taxonomy are in use, which the format archives only are when they are not
	 * disabled.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		if ( $this->taxonomy !== 'post_format' ) {
			return true;
		}

		return ! $this->options_helper->get( 'disable-post_format', false );
	}

	/**
	 * Ensures the taxonomy has default SEO settings.
	 *
	 * The format archives are always available, like on the settings page, so their settings can be changed while
	 * they are disabled, ahead of enabling them.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the taxonomy is missing or has no default SEO settings.
	 */
	public function ensure_available(): void {
		if ( $this->taxonomy === '' ) {
			$message = \sprintf(
				/* translators: %s expands to the name of a parameter. */
				\__( 'Provide the %s whose default SEO settings to use.', 'wordpress-seo' ),
				'taxonomy',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_missing_taxonomy', $message );
		}

		if ( $this->is_known_taxonomy || $this->taxonomy === 'post_format' ) {
			return;
		}

		if ( ! \in_array( $this->taxonomy, $this->taxonomy_helper->get_indexable_taxonomies(), true ) ) {
			$message = \sprintf(
				/* translators: 1: the name of a parameter, 2: the name of an ability. */
				\__( 'No taxonomy with SEO settings exists for the given %1$s. The %2$s ability lists the ones that do.', 'wordpress-seo' ),
				'taxonomy',
				'yoast-seo/get-archive-and-special-page-seo-settings',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_taxonomy', $message );
		}
	}
}
