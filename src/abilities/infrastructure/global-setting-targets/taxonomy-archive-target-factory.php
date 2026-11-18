<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Creates the targets of the default SEO settings of the taxonomies, one per taxonomy.
 */
class Taxonomy_Archive_Target_Factory {

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
	 * Constructor.
	 *
	 * @param Taxonomy_Helper $taxonomy_helper The taxonomy helper.
	 * @param Options_Helper  $options_helper  The options helper.
	 */
	public function __construct( Taxonomy_Helper $taxonomy_helper, Options_Helper $options_helper ) {
		$this->taxonomy_helper = $taxonomy_helper;
		$this->options_helper  = $options_helper;
	}

	/**
	 * Creates the target of a taxonomy, whether or not it has default SEO settings.
	 *
	 * @param string $taxonomy The taxonomy.
	 *
	 * @return Taxonomy_Archive_Target The target.
	 */
	public function create( string $taxonomy ): Taxonomy_Archive_Target {
		return new Taxonomy_Archive_Target( $taxonomy, $this->taxonomy_helper, $this->options_helper );
	}

	/**
	 * Creates the targets of all taxonomies with default SEO settings.
	 *
	 * The post formats are always included, like on the settings page, as they are left out of the indexable
	 * taxonomies while their archives are disabled.
	 *
	 * @return array<Taxonomy_Archive_Target> The targets.
	 */
	public function create_all(): array {
		$taxonomies = $this->taxonomy_helper->get_indexable_taxonomies();
		if ( ! \in_array( 'post_format', $taxonomies, true ) ) {
			$taxonomies[] = 'post_format';
		}

		$targets = [];
		foreach ( $taxonomies as $taxonomy ) {
			$targets[] = new Taxonomy_Archive_Target( $taxonomy, $this->taxonomy_helper, $this->options_helper, true );
		}

		return $targets;
	}
}
