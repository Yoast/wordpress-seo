<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * A helper object for indexables.
 */
class Indexable_Helper {

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * Indexable_Helper constructor.
	 *
	 * @param Options_Helper       $options_helper The options helper.
	 * @param Indexable_Repository $repository     The indexables repository.
	 */
	public function __construct( Options_Helper $options_helper, Indexable_Repository $repository ) {
		$this->options_helper = $options_helper;
		$this->repository     = $repository;
	}

	/**
	 * Returns the page type of an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|false The page type. False if it could not be determined.
	 */
	public function get_page_type_for_indexable( $indexable ) {
		switch ( $indexable->object_type ) {
			case 'post':
				$front_page_id = (int) \get_option( 'page_on_front' );
				if ( $indexable->object_id === $front_page_id ) {
					return 'Static_Home_Page';
					break;
				}
				$posts_page_id = (int) \get_option( 'page_for_posts' );
				if ( $indexable->object_id === $posts_page_id ) {
					return 'Static_Posts_Page';
					break;
				}
				return 'Post_Type';
				break;
			case 'term':
				return 'Term_Archive';
				break;
			case 'user':
				return 'Author_Archive';
				break;
			case 'home-page':
				return 'Home_Page';
				break;
			case 'post-type-archive':
				return 'Post_Type_Archive';
				break;
			case 'date-archive':
				return 'Date_Archive';
				break;
			case 'system-page':
				if ( $indexable->object_sub_type === 'search-result' ) {
					return 'Search_Result_Page';
				}
				if ( $indexable->object_sub_type === '404' ) {
					return 'Error_Page';
				}
		}

		return false;
	}

	/**
	 * Resets the permalinks of the indexables.
	 *
	 * @param string      $type    The type of the indexable.
	 * @param null|string $subtype The subtype. Can be null.
	 * @param string      $reason  The reason that the permalink has been changed.
	 */
	public function reset_permalink_indexables( $type = null, $subtype = null, $reason = Indexation_Permalink_Warning_Presenter::REASON_PERMALINK_SETTINGS ) {
		$result = $this->repository->reset_permalink( $type, $subtype );

		if ( $result !== false && $result > 0 ) {
			$this->options_helper->set( 'indexables_indexation_reason', $reason );
			$this->options_helper->set( 'ignore_indexation_warning', false );
			$this->options_helper->set( 'indexation_warning_hide_until', false );

			delete_transient( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY );
			delete_transient( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY );
			delete_transient( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY );
		}
	}
}
