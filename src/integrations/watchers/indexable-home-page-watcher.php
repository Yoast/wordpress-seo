<?php
/**
 * Home page watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Watches the home page options to save the meta information when updated.
 */
class Indexable_Home_Page_Watcher implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 * @param Indexable_Builder    $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo_titles', [ $this, 'check_option' ], 15, 3 );
		add_action( 'update_option_wpseo_social', [ $this, 'check_option' ], 15, 3 );
		add_action( 'update_option_blog_public', [ $this, 'build_indexable' ] );
		add_action( 'update_option_blogdescription', [ $this, 'build_indexable' ] );
		add_action( 'update_option_home', [ $this, 'build_indexable' ] );
	}

	/**
	 * Checks if the home page indexable needs to be rebuild based on option values.
	 *
	 * @param array  $old_value The old value of the option.
	 * @param array  $new_value The new value of the option.
	 * @param string $option    The name of the option.
	 *
	 * @return void
	 */
	public function check_option( $old_value, $new_value, $option ) {
		$relevant_keys = [
			'wpseo_titles' => [ 'title-home-wpseo', 'breadcrumbs-home', 'metadesc-home-wpseo' ],
			'wpseo_social' => [ 'og_frontpage_title', 'og_frontpage_desc', 'og_frontpage_image' ],
		];

		if ( ! isset( $relevant_keys[ $option ] ) ) {
			return;
		}

		foreach ( $relevant_keys[ $option ] as $key ) {
			// If both values aren't set they haven't changed.
			if ( ! isset( $old_value[ $key ] ) && ! isset( $new_value[ $key ] ) ) {
				continue;
			}

			// If the value was set but now isn't, is set but wasn't or is not the same it has changed.
			if ( ! isset( $old_value[ $key ] ) || ! isset( $new_value[ $key ] ) || $old_value[ $key ] !== $new_value[ $key ] ) {
				$this->build_indexable();
				return;
			}
		}
	}

	/**
	 * Saves the home page.
	 *
	 * @return void
	 */
	public function build_indexable() {
		$indexable = $this->repository->find_for_home_page( false );
		$indexable = $this->builder->build_for_home_page( $indexable );
		$indexable->save();
	}
}
