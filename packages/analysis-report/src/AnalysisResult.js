/* eslint-disable complexity */
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { noop } from "lodash";
import { select, dispatch } from "@wordpress/data";
import { getBlockContent, getBlockAttributes } from "@wordpress/blocks";

import { SvgIcon, IconButtonToggle, IconCTAEditButton, BetaBadge } from "@yoast/components";
import { strings } from "@yoast/helpers";

const { stripTagsFromHtmlString } = strings;
const ATTRIBUTE_FOR_ANALYSIS = {
	"core/paragraph": [
		{
			key: "content",
		},
	],
	"core/list": [
		{
			key: "values",
		},
	],
	"core/heading": [
		{
			key: "content",
		},
	],
	"core/audio": [
		{
			key: "caption",
		},
	],
	"core/embed": [
		{
			key: "caption",
		},
	],
	"core/gallery": [
		{
			key: "caption",
		},
	],
	"core/image": [
		{
			key: "caption",
		},
	],
	"core/table": [
		{
			key: "caption",
		},
		{
			key: "body",
		},
	],
	"core/video": [
		{
			key: "caption",
		},
	],
	"core/freeform": [
		{
			key: "content",
		},
	],
	"core/details": [
		{
			key: "summary",
		},
	],
	"yoast/faq-block": [
		{
			key: "questions",
		},
	],
	"yoast/how-to-block": [
		{
			key: "steps",
		},
		{
			key: "jsonDescription",
		},
	],
};

const ALLOWED_TAGS = [ "a", "b", "strong", "em", "i" ];

const AnalysisResultBase = styled.li`
	// This is the height of the IconButtonToggle.
	min-height: 24px;
	padding: 0;
	display: flex;
	align-items: flex-start;
	position: relative;
`;

const ScoreIcon = styled( SvgIcon )`
	margin: 3px 11px 0 0; // icon 13 + 11 right margin = 24 for the 8px grid.
`;

const AnalysisResultText = styled.p`
	margin: 0 16px 0 0;
	flex: 1 1 auto;
	color: ${ props => props.suppressedText ? "rgba(30,30,30,0.5)" : "inherit" };
`;

/**
 * Determines whether the mark buttons should be hidden.
 *
 * @param {Object} props The component's props.
 * @param {String} props.marksButtonStatus The status for the mark buttons.
 * @param {boolean} props.hasMarksButton Whether a mark button exists.
 * @returns {boolean} True if mark buttons should be hidden.
 */
const areMarkButtonsHidden = function( props ) {
	return ( ! props.hasMarksButton ) || props.marksButtonStatus === "hidden";
};

/**
 * Factory method which creates a new instance of the default mark button.
 *
 * @param {string} ariaLabel 	The button aria-label.
 * @param {string} id 			The button id.
 * @param {string} className 	The button class name.
 * @param {string} status 		Status of the buttons. Supports: "enabled", "disabled", "hidden".
 * @param {function} onClick 	Onclick handler.
 * @param {boolean} isPressed 	Whether the button is in a pressed state.
 *
 * @returns {JSX.Element} A new mark button.
 */
const createMarkButton = ( {
	ariaLabel,
	id,
	className,
	status,
	onClick,
	isPressed,
} ) => {
	return <IconButtonToggle
		marksButtonStatus={ status }
		className={ className }
		onClick={ onClick }
		id={ id }
		icon="eye"
		pressed={ isPressed }
		ariaLabel={ ariaLabel }
	/>;
};

const getInnerBlocksFromColumns = ( innerBlocks ) => {
	const innerBlocksArray = [];
	innerBlocks.forEach( block => {
		// If the block is a column or columns block, get the inner blocks of the column(s) and add them to the array.
		if ( block.innerBlocks.length > 0 && ( block.name === "core/column" || block.name === "core/columns" ) ) {
			innerBlocksArray.push( ...getInnerBlocksFromColumns( block.innerBlocks ) );
		} else {
			innerBlocksArray.push( block );
		}
	} );
	return innerBlocksArray;
};

/**
 * Returns an AnalysisResult component.
 *
 * @param {object} props Component props.
 * @param {Function} [markButtonFactory] Injectable factory to create mark button.
 *
 * @returns {ReactElement} The rendered AnalysisResult component.
 */
const AnalysisResult = ( { markButtonFactory, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	markButtonFactory = markButtonFactory || createMarkButton;
	const { id, marker, hasMarksButton } = props;

	let marksButton = null;
	if ( ! areMarkButtonsHidden( props ) ) {
		marksButton = markButtonFactory(
			{
				onClick: props.shouldUpsellHighlighting ? openModal : props.onButtonClickMarks,
				status: props.marksButtonStatus,
				className: props.marksButtonClassName,
				id: props.buttonIdMarks,
				isPressed: props.pressed,
				ariaLabel: props.ariaLabelMarks,
			}
		);
	}

	/*
	 * Update the marker status when there is a change in the following:
	 * a) the result's id, or
	 * b) the objects that need to be marked for the current result, or
	 * c) the information whether there is an object to be marked for the current result.
	 */
	useEffect( () => {
		props.onResultChange( id, marker, hasMarksButton );
	}, [ id, marker, hasMarksButton ] );

	const useAI = () => {
		// Get all blocks from the page
		const blocks = select( "core/block-editor" ).getBlocks();
		const textsForAIInput = [];

		// For each block in the array, retrieve the inner HTML from the block’s attributes, and collect it in an array
		blocks.forEach( block => {
			const innerHtml = getBlockContent( block );
			const blockClientId = block.clientId;

			textsForAIInput.push( { blockName: block.name, clientId: blockClientId, content: innerHtml } );

			if ( block.innerBlocks.length > 0 ) {
				const innerBlocks = getInnerBlocksFromColumns( block.innerBlocks );
				innerBlocks.forEach( innerBlock => {
					const innerblockHtml = getBlockContent( innerBlock );
					textsForAIInput.push( { blockName: innerBlock.name, clientId: innerBlock.clientId, content: innerblockHtml } );
				} );
			}
		} );

		// Send the array of texts `textsForAIInput` to the AI as the prompt content

		const clientIdsToUpdate = [];
		const attributesToUpdate = {};
		// Assume that the AI to return with an array of strings with the same format as the input: see `innerHtml`. I think we have to enforce this
		const textsFromAIOutput = [
			{ blockName: "core/paragraph", clientId: "01660b6f-016e-42c0-b694-9740ff7377b0", content: "<p>If you were to ask any <a href=\"https://www.womansday.com/life/g26913463/gifts-for-dog-lovers/\" target=\"_blank\" rel=\"noreferrer noopener\">dog person</a> why they prefer canines to felines, they’d probably tell you, “Because dogs are more <strong>affectionate</strong> than <em>cats</em>.” But contrary to popular belief, there are plenty of affectionate cat breeds that are just as attentive and cuddly as pups. Some of these devoted cats are content to sit in your lap while you pet them for hours. Others will actually run to greet you at the door. From the snuggly to the seriously sentimental, we’ve rounded up the cute <em>cats</em> out there, and they’ll provide just as many cuddles as any dog.</p>" },
			{ blockName: "core/list", clientId: "01660b6f-016e-42c0-b694-9740ff7377b0", content: "<li>Scottish fold <strong>affectionate</strong> cats</li>" },
			{ blockName: "core/heading", clientId: "01660b6f-016e-42c0-b694-9740ff7377b0", content: "<h2 class=\"wp-block-heading\">Ragdoll</h2>" },
		];

		// Parse the AI output to get the clientId and the innerHtml string
		textsFromAIOutput.forEach( output => {
			blocks.forEach( block => {
				// Parse the output to get the clientId and the innerHtml string
				// Here retrieve the client ID from the output `clientIdFromAIOutput`
				const clientIdFromAIOutput = output.clientId;
				// Here retrieve the innerHtml from the output `innerHtmlFromAIOutput`
				const innerHtmlFromAIOutput = output.content;
				const blockName = block.name;
				const blockClientId = block.clientId;
				if ( blockClientId === clientIdFromAIOutput ) {
					// Get block attributes from the innerHtmlFromAIOutput
					const outputAttr = getBlockAttributes( blockName, innerHtmlFromAIOutput );
					// Get relevant attributes based on the block name
					const getRelevantAttributes = ATTRIBUTE_FOR_ANALYSIS[ block.name ];
					// Using the retrieved relevant attribute's key, retrieve the value from the attributes output by the AI
					// Add this new attribute to the `attributesToUpdate` object
					getRelevantAttributes.forEach( attr => {
						attributesToUpdate[ blockClientId ] = {
							[ attr.key ]: outputAttr[ attr.key ],
						};
					} );
					// Add the blockClientId to clientIdsToUpdate list
					clientIdsToUpdate.push( blockClientId );
				}
			} );
		} );

		// Dispatch all new attributes to the store.
		dispatch( "core/block-editor" ).updateBlockAttributes( clientIdsToUpdate, attributesToUpdate, true );
	};

	return (
		<AnalysisResultBase>
			<ScoreIcon
				icon="circle"
				color={ props.bulletColor }
				size="13px"
			/>
			<AnalysisResultText suppressedText={ props.suppressedText }>
				{ props.hasBetaBadgeLabel && <BetaBadge /> }
				<span dangerouslySetInnerHTML={ { __html: stripTagsFromHtmlString( props.text, ALLOWED_TAGS ) } } />
			</AnalysisResultText>
			{ marksButton }
			{ props.renderHighlightingUpsell( isOpen, closeModal ) }
			{
				props.hasEditButton && props.isPremium &&
				<IconCTAEditButton
					className={ props.editButtonClassName }
					onClick={ props.onButtonClickEdit }
					id={ props.buttonIdEdit }
					icon="edit"
					ariaLabel={ props.ariaLabelEdit }
				/>
			}
			{ <button onClick={ useAI }>Sparkles</button> }
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	text: PropTypes.string.isRequired,
	suppressedText: PropTypes.bool,
	bulletColor: PropTypes.string.isRequired,
	hasMarksButton: PropTypes.bool.isRequired,
	hasEditButton: PropTypes.bool,
	buttonIdMarks: PropTypes.string.isRequired,
	buttonIdEdit: PropTypes.string,
	pressed: PropTypes.bool.isRequired,
	ariaLabelMarks: PropTypes.string.isRequired,
	ariaLabelEdit: PropTypes.string,
	onButtonClickMarks: PropTypes.func.isRequired,
	onButtonClickEdit: PropTypes.func,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	markButtonFactory: PropTypes.func,
	editButtonClassName: PropTypes.string,
	hasBetaBadgeLabel: PropTypes.bool,
	isPremium: PropTypes.bool,
	onResultChange: PropTypes.func,
	id: PropTypes.string,
	marker: PropTypes.oneOfType( [
		PropTypes.func,
		PropTypes.array,
	] ),
	shouldUpsellHighlighting: PropTypes.bool,
	renderHighlightingUpsell: PropTypes.func,
};

AnalysisResult.defaultProps = {
	suppressedText: false,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	hasBetaBadgeLabel: false,
	hasEditButton: false,
	buttonIdEdit: "",
	ariaLabelEdit: "",
	onButtonClickEdit: noop,
	isPremium: false,
	onResultChange: noop,
	id: "",
	marker: noop,
	shouldUpsellHighlighting: false,
	renderHighlightingUpsell: noop,
};

export default AnalysisResult;
