<?php

namespace Yoast\WP\SEO\Generators\Schema\Third_Party;

use stdClass;
use Tribe__Events__JSON_LD__Event;
use Tribe__Events__Template__Month;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * A class to handle textdomains and other Yoast Event Schema related logic..
 */
class Events_Calendar_Schema extends Abstract_Schema_Piece {

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	public $context;

	/**
	 * The helpers surface
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( \is_single() && \get_post_type() === 'tribe_events' ) {
			// The single event view.
			return true;
		}
		elseif ( \tribe_is_month() ) {
			// The month event view.
			return true;
		}

		return false;
	}

	/**
	 * Adds our Event piece of the graph.
	 * Partially lifted from the 'Tribe__JSON_LD__Abstract' class.
	 *
	 * @see https://docs.theeventscalendar.com/reference/classes/tribe__json_ld__abstract/
	 * @return array Event Schema markup
	 */
	public function generate() {
		$posts = [];

		if ( \is_singular( 'tribe_events' ) ) {
			global $post;
			$posts[] = $post;
		}
		elseif ( \tribe_is_month() ) {
			$posts = $this->get_month_events();
		}

		$tribe_data = $this->get_tribe_schema( $posts );
		$tribe_data = $this->transform_tribe_schema( $tribe_data );

		$data = [];
		foreach ( $tribe_data as $t ) {
			// Cast the schema object as array, the Yoast Class can't handle objects.
			$data[] = (array) $t;
		}

		// If the resulting array only has one entry, print it directly.
		if ( \count( $data ) === 1 ) {
			$data                     = $data[0];
			$data['mainEntityOfPage'] = [ '@id' => $this->context->generate_main_schema_id() ];
		}
		elseif ( \count( $data ) === 0 ) {
			$data = false;
		}

		return $data;
	}

	/**
	 * Get and return the schema markup for a collection of posts.
	 * If the posts array is empty, only the current post is returned.
	 *
	 * @param  array $posts The collection of posts we want schema markup for.
	 *
	 * @return array        The tribe schema for these posts.
	 */
	private function get_tribe_schema( array $posts = [] ) {
		$args = [
			// We do not want the @context to be shown.
			'context' => false,
		];

		$tribe_data = Tribe__Events__JSON_LD__Event::instance()->get_data( $posts, $args );
		$type       = \strtolower( \esc_attr( Tribe__Events__JSON_LD__Event::instance()->type ) );

		foreach ( $tribe_data as $post_id => $_data ) {
			Tribe__Events__JSON_LD__Event::instance()->set_type( $post_id, $type );
			// Register this post as done already.
			Tribe__Events__JSON_LD__Event::instance()->register( $post_id );
		}

		/**
		 * Allows the event data to be modifed by themes and other plugins.
		 *
		 * @example yoast_tec_json_ld_thing_data
		 * @example yoast_tec_json_ld_event_data
		 *
		 * @param array $data objects representing the Google Markup for each event.
		 * @param array $args the arguments used to get data
		 */
		$tribe_data = \apply_filters( "yoast_tec_json_ld_{$type}_data", $tribe_data, $args );

		return $tribe_data;
	}

	/**
	 * Transform the tribe schema markup and adapt it to the Yoast SEO standard.
	 *
	 * @param  array $data The data retrieved from the TEC plugin.
	 *
	 * @return array       The transformed event data.
	 */
	private function transform_tribe_schema( array $data = [] ) {
		$new_data = [];

		foreach ( $data as $post_id => $d ) {
			$permalink = \get_permalink( $post_id );

			// EVENT.
			// Generate an @id for the event.
			$d->{'@id'} = $permalink . '#' . \strtolower( \esc_attr( $d->{'@type'} ) );

			// Transform the post_thumbnail from the url to the @id of #primaryimage.
			if ( \has_post_thumbnail( $post_id ) ) {
				if ( \is_singular( 'tribe_events' ) ) {
					// On a single view we can assume that Yoast SEO already printed the
					// image schema for the post thumbnail.
					$d->image = (object) [
						'@id' => $permalink . '#primaryimage',
					];
				}
				else {
					$image_id  = \get_post_thumbnail_id( $post_id );
					$schema_id = $permalink . '#primaryimage';
					$d->image  = $this->helpers->schema->image->generate_from_attachment_id( $schema_id, $image_id );
				}
			}

			if ( isset( $d->description ) && ! empty( $d->description ) ) {
				// By the time the description arrives in this plugin it is heavily
				// escaped. That's why we basically pull new text from the database.
				$d->description = \get_the_excerpt( $post_id );
			}

			// ORGANIZER.
			if ( \tribe_has_organizer( $post_id ) ) {
				if ( ! $d->organizer ) {
					$d->organizer = new stdClass();
				}

				$organizer_id              = \tribe_get_organizer_id( $post_id );
				$d->organizer->description = \get_the_excerpt( $organizer_id );

				// Fix empty organizer/url and wrong organizer/sameAs.
				if ( isset( $d->organizer->sameAs ) && $d->organizer->url === false ) {
					$d->organizer->url = $d->organizer->sameAs;
				}
				unset( $d->organizer->sameAs );
			}

			// VENUE / LOCATION.
			if ( \tribe_has_venue( $post_id ) ) {
				if ( ! $d->location ) {
					$d->location = new stdClass();
				}

				$venue_id                 = \tribe_get_venue_id( $post_id );
				$d->location->description = \get_the_excerpt( $venue_id );
			}

			/*
			 * PERFORMER
			 * Unset the performer, as it is currently unused.
			 * @see: https://github.com/moderntribe/the-events-calendar/blob/5e737eb820c59bb9639d9ee9f4b88931a51c8554/src/Tribe/JSON_LD/Event.php#L151
			 */
			unset( $d->performer );

			// OFFERS.
			if ( isset( $d->offers ) && \is_array( $d->offers ) ) {
				foreach ( $d->offers as $key => $offer ) {
					unset( $d->offers[ $key ]->category );
				}
			}

			$new_data[ $post_id ] = $d;
		}

		return $new_data;
	}

	/**
	 * Get an array of events for the requested month.
	 *
	 * @return array An array of posts of the custom post type event.
	 */
	private function get_month_events() {
		$wp_query = \tribe_get_global_query_object();

		$event_date = $wp_query->get( 'eventDate' );

		$month = $event_date;
		if ( empty( $month ) ) {
			$month = \tribe_get_month_view_date();
		}

		$args = [
			'eventDisplay'   => 'custom',
			'start_date'     => Tribe__Events__Template__Month::calculate_first_cell_date( $month ),
			'end_date'       => Tribe__Events__Template__Month::calculate_final_cell_date( $month ),
			'posts_per_page' => -1,
			'hide_upcoming'  => true,
		];

		return \tribe_get_events( $args );
	}
}
