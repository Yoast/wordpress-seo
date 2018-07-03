/* global jQuery */

import React from "react";
import findIndex from "lodash/findIndex";
import { addSynonyms, removeSynonyms } from "yoast-components/composites/Plugin/Synonyms/actions/synonyms";

const $ = jQuery;

/**
 * Wraps a component with a listener.
 *
 * @param {Object} store The store to dispatch to.
 *
 * @returns {Function} The function to wrap a component with a store listener.
 */
export default function listenToActiveKeyword( store ) {
	return ( WrappedComponent ) => {
		class ActiveKeywordWrapper extends React.Component {
			/**
			 * Initializes the ActiveKeywordWrapper class.
			 *
			 * @param {Object} props              The props.
			 * @param {string} props.keywordQuery The jQuery selector to find all the keywords.
			 *
			 * @returns {void}
			 */
			constructor( props ) {
				super( props );

				this.state = {
					index: this.getActiveKeywordIndex(),
				};

				this.handleTabChange = this.handleTabChange.bind( this );
				this.handleRemoveChange = this.handleRemoveChange.bind( this );
				this.handleAddChange = this.handleAddChange.bind( this );
			}

			/**
			 * Initialize listeners.
			 *
			 * @returns {void}
			 */
			componentDidMount() {
				$( ".wpseo-metabox-tabs" ).on( "click", ".wpseo_keyword_tab > .wpseo_tablink", this.handleTabChange );
				$( ".wpseo-metabox-tabs" ).on( "_yoast_remove_keyword", this.handleRemoveChange );
				$( ".wpseo-add-keyword" ).on( "click", this.handleAddChange );
			}

			/**
			 * Remove listeners.
			 *
			 * @returns {void}
			 */
			componentWillUnmount() {
				$( ".wpseo-metabox-tabs" ).off( "click", ".wpseo_keyword_tab > .wpseo_tablink", this.handleTabChange );
				$( ".wpseo-metabox-tabs" ).off( "_yoast_remove_keyword", this.handleRemoveChange );
				$( ".wpseo-add-keyword" ).off( "click", this.handleAddChange );
			}

			/**
			 * Retrieves the keywords from the HTML page.
			 *
			 * @returns {Array} The keywords.
			 */
			getKeywords() {
				const elements = $( this.props.keywordQuery );
				const keywords = [];

				elements.each( ( index, element ) => {
					keywords.push( $( element ).data( "keyword" ) );
				} );

				return keywords;
			}

			/**
			 * Retrieves the active keyword index from the HTML page.
			 *
			 * @returns {number} The index of the active keyword.
			 */
			getActiveKeywordIndex() {
				const elements = $( this.props.keywordQuery );
				let activeKeywordIndex = -1;

				elements.each( ( index, element ) => {
					if ( $( element ).parent().hasClass( "active" ) ) {
						activeKeywordIndex = index;
					}
				} );

				return activeKeywordIndex;
			}

			/**
			 * Handles keyword tab changes.
			 *
			 * @returns {void}
			 */
			handleTabChange() {
				const index = this.getActiveKeywordIndex();

				if ( index !== this.state.index ) {
					this.setState( { index } );
				}
			}

			/**
			 * Handles keyword remove changes.
			 *
			 * @param {Event}  clickEvent The event.
			 * @param {number} index      The index of the removed keyword.
			 *
			 * @returns {void}
			 */
			handleRemoveChange( clickEvent, index ) {
				store.dispatch( removeSynonyms( index ) );
				this.handleTabChange();
			}

			/**
			 * Handles keyword add changes.
			 *
			 * @returns {void}
			 */
			handleAddChange() {
				store.dispatch( addSynonyms( "" ) );
			}

			render() {
				return (
					<WrappedComponent
						{ ...this.state }
						{ ...this.props }
					/>
				);
			}
		}

		ActiveKeywordWrapper.propTypes = {
			keywordQuery: React.PropTypes.string,
		};

		ActiveKeywordWrapper.defaultProps = {
			keywordQuery: "#wpseo-meta-section-content .wpseo_keyword_tab .wpseo_tablink[data-keyword]",
		};

		return ActiveKeywordWrapper;
	};
}
