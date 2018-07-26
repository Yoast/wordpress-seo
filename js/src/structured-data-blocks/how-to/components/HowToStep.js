import React from "react";
import PropTypes from "prop-types";

const { Component, renderToString } = window.wp.element;
const { __ } = window.wp.i18n;
const { IconButton } = window.wp.components;
const { RichText, MediaUpload } = window.wp.editor;
const { getBlockContent } = window.wp.blocks;

/**
 * A How-to step within a How-to block.
 */
export default class HowToStep extends Component {

	constructor( props ) {
		super( props );

		this.onSplit       = this.onSplit.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );
	}

	/**
	 * The insert and remove step buttons.
	 * @param {function} insertStep a callback function for inserting a new How-to step after this one
	 * @param {function} removeStep a callback function for removing this How-to step
	 * @returns {Component} the buttons
	 */
	getButtons( insertStep, removeStep ) {
		return <div className="schema-how-to-step-button-container">
			{ ! HowToStep.getImageSrc( this.props.step.contents ) &&
			<MediaUpload
				onSelect={ this.onSelectImage }
				type="image"
				value={ this.props.step.id }
				render={ ( { open } ) => (
					<IconButton
						className="schema-how-to-step-button editor-inserter__toggle how-to-step-add-media"
						icon="insert"
						onClick={ open }
					>
						{ __( "Add image" ) }
					</IconButton>
				) }
			/>
			}
			<IconButton
				className="schema-how-to-step-button editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete step" ) }
				onClick={ removeStep }
			>
			</IconButton>
			<IconButton
				className="schema-how-to-step-button editor-inserter__toggle"
				icon="insert"
				label={ __( "Insert step" ) }
				onClick={ insertStep }
			>
			</IconButton>
		</div>;
	}

	getMover() {
		return <div className="schema-how-to-step-mover">
			{ ! this.props.isFirst &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move step up" ) }
			/>
			}
			{ ! this.props.isLast &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.isLast ? null : this.props.onMoveDown }
				icon="arrow-down-alt2"
				label={ __( "Move step down" ) }
			/>
			}
		</div>;
	}

	/**
	 * Callback when an image from the media library has been selected.
	 * @param {Object} media The selected image.
	 * @returns {void}
	 */
	onSelectImage( media ) {
		let contents = this.props.step.contents.slice();
		let image    = <img key={ media.id } alt={ media.alt } src={ media.url } />;

		if ( contents.push ) {
			contents.push( image );
		} else {
			contents = [ contents, image ];
		}

		this.props.onChange( contents );
	}

	/**
	 * Splits this step into multiple steps.
	 * @param {array}        before The content before the split.
	 * @param {array|string} after  The content after the split.
	 * @param {WPBlock[]}    blocks The blocks that should be inserted at the split.
	 * @returns {void}
	 */
	onSplit( before, after, ...blocks ) {
		let newSteps = [];

		for ( let i = 0; i < blocks.length; i++ ) {
			let block = blocks[ i ];

			// If list blocks are inserted split them into their values.
			if ( block.name === "core/list" ) {
				newSteps = newSteps.concat( block.attributes.values.map( ( value ) => value.props.children ) );
				continue;
			}

			// Otherwise add the block.
			newSteps.push( getBlockContent( block ) );
		}

		if ( after ) {
			newSteps.push( after );
		}

		// If there"s no before then the first new step is this step.
		if ( ! before ) {
			before = newSteps.pop();
		}

		this.props.onChange( before );

		newSteps.forEach( this.props.insertStep );
	}

	/**
	 * Strips html from a string
	 * @param {string} html the html string
	 * @returns {string} the html string, with all the html elements stripped from it.
	 */
	static stripHTML( html ) {
		let tmp = document.createElement( "DIV" );
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}

	static getImageSrc( contents ) {
		if ( ! contents || ! contents.filter ) {
			return false;
		}

		let image = contents.filter( ( node ) => node && node.type && node.type === "img" )[ 0 ];

		if ( ! image ) {
			return false;
		}

		return image.props.src;
	}

	/**
	 * Generates a JSON-LD representation of the given How-to step
	 * @param {object} step the How-to step
	 * @param {string} step.contents the text of the How-to step
	 * @param {number} index the index of the step in the How-to block (or section)
	 * @returns {Object} the JSON-LD representation of the given step
	 */
	static toJSONLD( step, index ) {
		let jsonLD = {
			"@type": "HowToStep",
			position: ( index + 1 ).toString(),
			text: this.stripHTML( renderToString( step.contents ) ),
		};
		let imageSrc = HowToStep.getImageSrc( step.contents );

		if ( imageSrc ) {
			jsonLD.associatedMedia = {
				"@type": "ImageObject",
				contentUrl: imageSrc,
			};
		}

		return jsonLD;
	}

	/**
	 * Returns the component of the given How-to step to be rendered in a WordPress post
	 * (e.g. not in the editor).
	 * @param {object} step the How-to step
	 * @returns {Component} the component to be rendered
	 */
	static getContent( step ) {
		return <RichText.Content
			tagName="li"
			className="schema-how-to-step"
			key={ step.id }
			value={ step.contents }
		/>;
	}

	render() {
		let {
			index,
			step,
			onChange,
			insertStep,
			removeStep,
			onFocus,
			isSelected,
			editorRef,
		} = this.props;

		let { id, contents } = step;

		return (
			<li className="schema-how-to-step" onFocus={ onFocus } >
				<span className="schema-how-to-step-number">{ index + 1 }.</span>
				<RichText
					onSetup={ editorRef }
					key={ id }
					value={ contents }
					onChange={ onChange }
					isSelected={ isSelected }
					onSplit={ this.onSplit }
					placeholder={ __( "Enter a step description", "structured-data-block/how-to-block" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelected && this.getMover() }
				{ isSelected && this.getButtons( insertStep, removeStep ) }
			</li>
		);
	}
}

HowToStep.propTypes = {
	index: PropTypes.number.isRequired,
	step: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	insertStep: PropTypes.func.isRequired,
	removeStep: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,

	isSelected: PropTypes.bool,
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool,
};
