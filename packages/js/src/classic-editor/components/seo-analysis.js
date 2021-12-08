/* global wpseoAdminL10n */
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { YoastSeoIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SeoResultsContainer } from "@yoast/seo-integration";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { ContentAnalysis } from "@yoast/analysis-report";

import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import AnalysisUpsell from "../../components/AnalysisUpsell";
import { ModalContainer, ModalIcon } from "../../components/modals/Container";
import KeywordSynonyms from "../../components/modals/KeywordSynonyms";
import MultipleKeywords from "../../components/modals/MultipleKeywords";
import Modal from "../../components/modals/SeoAnalysisModal";
import ScoreIconPortal from "../../components/portals/ScoreIconPortal";
import SynonymSlot from "../../components/slots/SynonymSlot";
import { getIconForScore } from "../../components/contentAnalysis/mapResults";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 1.5em 0 1em;
	display: block;
`;

/**
 * The UpsellBox component.
 *
 * @returns {wp.Element} The UpsellBox component.
 */
const KeywordUpsell = () => {
	const link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_link" ];
	const buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_button" ];

	return (
		<MetaboxCollapsible
			prefixIcon={ { icon: "plus", color: colors.$color_grey_medium_dark } }
			prefixIconCollapsed={ { icon: "plus", color: colors.$color_grey_medium_dark } }
			title={ __( "Add related keyphrase", "wordpress-seo" ) }
			id={ "yoast-additional-keyphrase-collapsible-metabox" }
		>
			<MultipleKeywords
				link={ link }
				buyLink={ buyLink }
			/>
		</MetaboxCollapsible>
	);
};

/**
 * The keyword synonyms upsell modal.
 *
 * @returns {wp.Element} A modalButtonContainer component with the modal for a keyword synonyms upsell.
 */
const SynonymsUpsell = () => {
	const modalProps = {
		classes: {
			openButton: "wpseo-keyword-synonyms button-link",
		},
		labels: {
			open: "+ " + __( "Add synonyms", "wordpress-seo" ),
			modalAriaLabel: sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( "Get %s", "wordpress-seo" ),
				"Yoast SEO Premium"
			),
			heading: sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( "Get %s", "wordpress-seo" ),
				"Yoast SEO Premium"
			),
		},
	};

	// Defaults to metabox.
	const link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_link" ];
	const buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_button" ];

	return (
		<Modal { ...modalProps }>
			<ModalContainer>
				<ModalIcon icon={ YoastSeoIcon } />
				<h2>{ __( "Would you like to add keyphrase synonyms?", "wordpress-seo" ) }</h2>

				<KeywordSynonyms link={ link } buyLink={ buyLink } />
			</ModalContainer>
		</Modal>
	);
};

/**
 * The multiple keywords upsell modal.
 *
 * @returns {wp.Element} A modalButtonContainer component with the modal for a multiple keywords upsell.
 */
const MultipleKeywordsUpsell = () => {
	const modalProps = {
		classes: {
			openButton: "wpseo-multiple-keywords button-link",
		},
		labels: {
			open: "+ " + __( "Add related keyphrase", "wordpress-seo" ),
			modalAriaLabel: sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( "Get %s", "wordpress-seo" ),
				"Yoast SEO Premium"
			),
			heading: sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( "Get %s", "wordpress-seo" ),
				"Yoast SEO Premium"
			),
		},
	};

	// Defaults to metabox
	const link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_link" ];
	const buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_button" ];

	return (
		<Modal { ...modalProps }>
			<ModalContainer>
				<ModalIcon icon={ YoastSeoIcon } />
				<h2>{ __( "Would you like to add a related keyphrase?", "wordpress-seo" ) }</h2>
				<MultipleKeywords
					link={ link }
					buyLink={ buyLink }
				/>
			</ModalContainer>
		</Modal>
	);
};

/**
 * The SEO Analysis component.
 *
 * @param {object} props The component's props.
 *
 * @returns {wp.Element} The SEO Analysis component.
 */
const SeoAnalysisContainer = props => {
	const { shouldUpsell, shouldUpsellWordFormRecognition } = props;

	const focusKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase() );
	const seoScore = useSelect( select => select( SEO_STORE_NAME ).selectSeoScore() );

	const score = getIndicatorForScore( seoScore );

	if ( score.className !== "loading" && focusKeyphrase === "" ) {
		score.className = "na";
		score.screenReaderReadabilityText = __( "Enter a focus keyphrase to calculate the SEO score", "wordpress-seo" );
	}

	return (
		<>
			<MetaboxCollapsible
				title={ __( "SEO analysis", "wordpress-seo" ) }
				titleScreenReaderText={ score.screenReaderReadabilityText }
				prefixIcon={ getIconForScore( score.className ) }
				prefixIconCollapsed={ getIconForScore( score.className ) }
				subTitle={ focusKeyphrase }
				id={ "yoast-seo-analysis-collapsible-metabox" }
			>
				<SynonymSlot location="metabox" />
				{ shouldUpsell &&
					<>
						<SynonymsUpsell />
						<MultipleKeywordsUpsell />
					</>
				}
				{ shouldUpsellWordFormRecognition && <AnalysisUpsell
					url={ wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_metabox" ] }
					alignment={ "horizontal" }
				/> }
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
				</AnalysisHeader>
				<SeoResultsContainer as={ ContentAnalysis } />
			</MetaboxCollapsible>
			{ shouldUpsell && <KeywordUpsell /> }
			<ScoreIconPortal
				target="wpseo-seo-score-icon"
				scoreIndicator={ score.className }
			/>
		</>
	);
};

SeoAnalysisContainer.propTypes = {
	shouldUpsell: PropTypes.bool,
	shouldUpsellWordFormRecognition: PropTypes.bool,
};

SeoAnalysisContainer.defaultProps = {
	shouldUpsell: false,
	shouldUpsellWordFormRecognition: false,
};

export default SeoAnalysisContainer;
