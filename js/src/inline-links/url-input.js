import { throttle } from "lodash";
import classnames from "classnames";
import scrollIntoView from "dom-scroll-into-view";
import PropTypes from "prop-types";
import apiFetch from "@wordpress/api-fetch";
import { Spinner, withSpokenMessages, Popover } from "@wordpress/components";
import { withInstanceId } from "@wordpress/compose";
import { Component, createRef } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { __, sprintf, _n } from "@wordpress/i18n";
import { UP, DOWN, ENTER, TAB } from "@wordpress/keycodes";
import { addQueryArgs } from "@wordpress/url";

/**
 * Since URLInput is rendered in the context of other inputs, but should be considered a separate modal node, prevent keyboard events from
 * propagating as being considered from the input.
 *
 * @param {object} event Event.
 * @returns {void}
 */
const stopEventPropagation = ( event ) => event.stopPropagation();

/**
 * The UrlInput component.
 */
class URLInput extends Component {
	/**
	 * The constructor.
	 *
	 * @param {object} autocompleteRef The autocomplete Ref.
	 *
	 * @returns {void}
	 */
	constructor( { autocompleteRef } ) {
		super( ...arguments );

		this.onChange = this.onChange.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.autocompleteRef = autocompleteRef || createRef();
		this.inputRef = createRef();
		this.updateSuggestions = throttle( this.updateSuggestions.bind( this ), 200 );

		this.suggestionNodes = [];

		this.state = {
			posts: [],
			showSuggestions: false,
			selectedSuggestion: null,
		};
	}

	/**
	 * Lifecycle function.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		const { showSuggestions, selectedSuggestion } = this.state;
		// Only have to worry about scrolling selected suggestion into view when already expanded.
		if ( showSuggestions && selectedSuggestion !== null && ! this.scrollingIntoView ) {
			this.scrollingIntoView = true;
			scrollIntoView( this.suggestionNodes[ selectedSuggestion ], this.autocompleteRef.current, {
				onlyScrollIfNeeded: true,
			} );

			setTimeout( () => {
				this.scrollingIntoView = false;
			}, 100 );
		}
	}

	/**
	 * Lifecycle function.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		delete this.suggestionsRequest;
	}

	/**
	 * Binds the refs to suggestionnodes.
	 *
	 * @param {int} index the index of the node.
	 * @returns {Function} the function.
	 */
	bindSuggestionNode( index ) {
		return ( ref ) => {
			this.suggestionNodes[ index ] = ref;
		};
	}

	/**
	 * Updates the suggestions.
	 *
	 * @param {string} value The value string.
	 *
	 * @returns {void}
	 */
	updateSuggestions( value ) {
		// Show the suggestions after typing at least 2 characters and also for URLs.
		if ( value.length < 2 || /^https?:/.test( value ) ) {
			this.setState( {
				showSuggestions: false,
				selectedSuggestion: null,
				loading: false,
			} );

			return;
		}

		this.setState( {
			showSuggestions: true,
			selectedSuggestion: null,
			loading: true,
		} );

		/* eslint-disable camelcase */
		const request = apiFetch( {
			path: addQueryArgs( "/wp/v2/search", {
				search: value,
				per_page: 20,
				type: "post",
			} ),
		} );
		/* eslint-enable camelcase */

		/**
		 * A fetch Promise doesn"t have an abort option. It"s mimicked by comparing the request reference in on the instance,
		 * which is reset or deleted on subsequent requests or unmounting.
		 */
		request.then( ( posts ) => {
			if ( this.suggestionsRequest !== request ) {
				return;
			}

			this.setState( {
				posts,
				loading: false,
			} );

			if ( posts.length ) {
				this.props.debouncedSpeak( sprintf( _n(
					"%d result found, use up and down arrow keys to navigate.",
					"%d results found, use up and down arrow keys to navigate.",
					posts.length,
					"wordpress-seo"
				), posts.length ), "assertive" );
			} else {
				this.props.debouncedSpeak( __( "No results.", "wordpress-seo" ), "assertive" );
			}
		} ).catch( () => {
			if ( this.suggestionsRequest === request ) {
				this.setState( {
					loading: false,
				} );
			}
		} );

		this.suggestionsRequest = request;
	}

	/**
	 * Onchange callback.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
	onChange( event ) {
		const inputValue = event.target.value;
		this.props.onChange( inputValue );
		this.updateSuggestions( inputValue );
	}

	/* eslint-disable complexity */
	/* eslint-disable max-statements */
	/**
	 * OnKeyDown callback.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
	onKeyDown( event ) {
		const { showSuggestions, selectedSuggestion, posts, loading } = this.state;

		/**
		 * If the suggestions are not shown or loading, we shouldn"t handle the arrow keys.
		 * We shouldn"t preventDefault to allow block arrow keys navigation
		 */
		if ( ! showSuggestions || ! posts.length || loading ) {
			/**
			 * In the Windows version of Firefox the up and down arrows don"t move the caret within an input field like they do for
			 * Mac Firefox/Chrome/Safari. This causes a form of focus trapping that is disruptive to the user experience. This disruption only happens
			 * if the caret is not in first or last position in the text input.
			 * @see: https://github.com/WordPress/gutenberg/issues/5693#issuecomment-436684747
			 */
			switch ( event.keyCode ) {
				// When UP is pressed, if the caret is at the start of the text, move it to the 0 position.
				case UP: {
					if ( 0 !== event.target.selectionStart ) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to position 0
						event.target.setSelectionRange( 0, 0 );
					}
					break;
				}
				// When DOWN is pressed, if the caret is not at the end of the text, move it to the last position.
				case DOWN: {
					if ( this.props.value.length !== event.target.selectionStart ) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to the last position
						event.target.setSelectionRange( this.props.value.length, this.props.value.length );
					}
					break;
				}
			}

			return;
		}

		const post = this.state.posts[ this.state.selectedSuggestion ];

		switch ( event.keyCode ) {
			case UP: {
				event.stopPropagation();
				event.preventDefault();
				const previousIndex = selectedSuggestion ? selectedSuggestion - 1 : posts.length - 1;
				this.setState( {
					selectedSuggestion: previousIndex,
				} );
				break;
			}
			case DOWN: {
				event.stopPropagation();
				event.preventDefault();
				const nextIndex = selectedSuggestion === null || ( selectedSuggestion === posts.length - 1 ) ? 0 : selectedSuggestion + 1;
				this.setState( {
					selectedSuggestion: nextIndex,
				} );
				break;
			}
			case TAB: {
				if ( this.state.selectedSuggestion !== null ) {
					this.selectLink( post );
					// Announce a link has been selected when tabbing away from the input field.
					this.props.speak( __( "Link selected.", "wordpress-seo" ) );
				}
				break;
			}
			case ENTER: {
				if ( this.state.selectedSuggestion !== null ) {
					event.stopPropagation();
					this.selectLink( post );
				}
				break;
			}
		}
	}
	/* eslint-enable complexity */
	/* eslint-enable max-statements */

	/**
	 * Selects the link.
	 *
	 * @param {object} post The post.
	 *
	 * @returns {void}
	 */
	selectLink( post ) {
		this.props.onChange( post.url, post );
		this.setState( {
			selectedSuggestion: null,
			showSuggestions: false,
		} );
	}

	/**
	 * Onclick handler.
	 *
	 * @param {object} post The post.
	 *
	 * @returns {void}
	 */
	handleOnClick( post ) {
		this.selectLink( post );
		// Move focus to the input field when a link suggestion is clicked.
		this.inputRef.current.focus();
	}

	/**
	 * Render method.
	 *
	 * @returns {wp.Element} The component.
	 */
	render() {
		const { value = "", autoFocus = true, instanceId, className } = this.props;
		const { showSuggestions, posts, selectedSuggestion, loading } = this.state;
		/* eslint-disable jsx-a11y/no-autofocus */
		/* eslint-disable jsx-a11y/role-has-required-aria-props */
		/* eslint-disable react/jsx-boolean-value */
		return (
			<div className={ classnames( "editor-url-input block-editor-url-input", className ) }>
				<input
					autoFocus={ autoFocus }
					type="text"
					aria-label={ __( "URL", "wordpress-seo" ) }
					required
					value={ value }
					onChange={ this.onChange }
					onInput={ stopEventPropagation }
					placeholder={ __( "Paste URL or type to search", "wordpress-seo" ) }
					onKeyDown={ this.onKeyDown }
					role="combobox"
					aria-expanded={ showSuggestions }
					aria-autocomplete="list"
					aria-owns={ `editor-url-input-suggestions-${ instanceId }` }
					aria-activedescendant={
						/* eslint-disable no-undefined */
						selectedSuggestion === null ? undefined : `editor-url-input-suggestion-${ instanceId }-${ selectedSuggestion }`
						/* eslint-enable no-undefined */
					}
					ref={ this.inputRef }
				/>

				{ ( loading ) && <Spinner /> }

				{ showSuggestions && !! posts.length &&
					<Popover position="bottom" noArrow focusOnMount={ false }>
						<div
							className={ classnames(
								"editor-url-input__suggestions",
								"block-editor-url-input__suggestions",
								`${ className }__suggestions`
							) }
							id={ `editor-url-input-suggestions-${ instanceId }` }
							ref={ this.autocompleteRef }
							role="listbox"
						>
							{ posts.map( ( post, index ) => (
								<button
									key={ post.id }
									role="option"
									tabIndex="-1"
									id={ `editor-url-input-suggestion-${ instanceId }-${ index }` }
									ref={ this.bindSuggestionNode( index ) }
									className={ classnames( "editor-url-input__suggestion block-editor-url-input__suggestion", {
										"is-selected": index === selectedSuggestion,
									} ) }
									onClick={ () => this.handleOnClick( post ) }
									aria-selected={ index === selectedSuggestion }
								>
									{ decodeEntities( post.title ) || __( "(no title)", "wordpress-seo" ) }
								</button>
							) ) }
						</div>
					</Popover>
				}
			</div>
		);
		/* eslint-enable jsx-a11y/no-autofocus */
		/* eslint-enable react/jsx-boolean-value */
		/* eslint-enable jsx-a11y/role-has-required-aria-props */
	}
}

URLInput.propTypes = {
	autocompleteRef: PropTypes.object,
	debouncedSpeak: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ),
	speak: PropTypes.func.isRequired,
	autoFocus: PropTypes.bool,
	instanceId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

URLInput.defaultProps = {
	autocompleteRef: null,
	value: "",
	autoFocus: true,
	className: "",
};

export default withSpokenMessages( withInstanceId( URLInput ) );
