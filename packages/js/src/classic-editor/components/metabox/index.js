/* global wpseoScriptData wpseoAdminL10n */

import { Fill } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { MARKER_STATUS, SEO_STORE_NAME, useAnalyze } from "@yoast/seo-integration";
import { forEach } from "lodash";
import { markers } from "yoastseo";
import SocialMetadataPortal from "../../../components/portals/SocialMetadataPortal";
import SidebarItem from "../../../components/SidebarItem";
import SchemaTabContainer from "../../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../../containers/SEMrushRelatedKeyphrases";
import Warning from "../../../containers/Warning";
import { DOM_IDS } from "../../dom";
import { EDITOR_STORE_NAME } from "../../editor-store";
import AdvancedSettings from "../advanced-settings";
import CornerstoneContent from "../cornerstone-content";
import FocusKeyphraseInput from "../focus-keyphrase-input";
import GooglePreview from "../google-preview";
import ReadabilityAnalysis from "../readability-analysis";
import SeoAnalysis from "../seo-analysis";

const useEditor = () => {
	const [ editor, setEditor ] = useState( null );

	const contentEditorListener = useCallback( ( e ) => {
		if ( e.editor.id === DOM_IDS.CONTENT ) {
			setEditor( e.editor );
		}
	}, [ setEditor ] );

	useEffect( () => {
		if ( ! tinymce ) {
			return;
		}

		// Is the editor already present? Use that.
		const contentEditor = tinymce.get( DOM_IDS.CONTENT );
		if ( contentEditor ) {
			setEditor( contentEditor );
			return;
		}

		// Listen for the editor.
		tinymce.on( "AddEditor", contentEditorListener );
	}, [ tinymce ] );

	// Remove our listener (whether it was actually enabled or not).
	useEffect( () => {
		if ( editor ) {
			tinymce.off( "AddEditor", contentEditorListener );
		}
	}, [ editor ] );

	return editor;
};

/**
 * Creates the Metabox component.
 *
 * @returns {JSX.Element} The Metabox.
 */
const Metabox = () => {
	const settings = useSelect( select => select( EDITOR_STORE_NAME ).getPreferences() );
	const isSeoAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsSeoAnalysisActive() );
	const isReadabilityAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsReadabilityAnalysisActive() );

	const activeMarkerId = useSelect( select => select( SEO_STORE_NAME ).selectActiveMarkerId() );
	const marks = useSelect( select => select( SEO_STORE_NAME ).selectActiveMarks() );
	const markerStatus = useSelect( select => select( SEO_STORE_NAME ).selectMarkerStatus() );
	const { updateActiveMarker, updateMarkerStatus } = useDispatch( SEO_STORE_NAME );

	useAnalyze();

	const editor = useEditor();

	useEffect( () => {
		const hasEditor = editor && editor.dom;
		const hasMarkings = activeMarkerId !== "" && marks.length > 0;

		if ( ! hasEditor || ! hasMarkings ) {
			return;
		}

		let content = editor.getContent();
		content = markers.removeMarks( content );

		forEach( marks, mark => {
			content = content.split( mark.original ).join( mark.marked );
		} );

		content = content
			.replace( new RegExp( "&lt;yoastmark.+?&gt;", "g" ), "" )
			.replace( new RegExp( "&lt;/yoastmark&gt;", "g" ), "" );

		editor.setContent( content );

		/*
		 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
		 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
		 */
		const markElements = editor.dom.select( "yoastmark" );
		forEach( markElements, markElement => {
			markElement.setAttribute( "data-mce-bogus", "1" );
		} );
	}, [ editor, activeMarkerId, marks ] );

	useEffect( () => {
		if ( editor === null ) {
			return;
		}

		updateMarkerStatus( editor.isHidden() ? MARKER_STATUS.DISABLED : MARKER_STATUS.ENABLED );
		editor.on( "hide", () => {
			updateActiveMarker( { id: "", marks: [] } );
			updateMarkerStatus( MARKER_STATUS.DISABLED );
		} );
		editor.on( "show", () => {
			updateMarkerStatus( MARKER_STATUS.ENABLED );
		} );
	}, [ editor ] );

	return (
		<Fragment>
			<SidebarItem key="warning" renderPriority={ 1 }>
				<Warning />
			</SidebarItem>
			{ isSeoAnalysisActive &&
				<SidebarItem key="keyword-input" renderPriority={ 8 }>
					<FocusKeyphraseInput focusKeyphraseInfoLink={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] } />
					{ ! wpseoScriptData.metabox.isPremium &&
						<Fill name="YoastRelatedKeyphrases">
							<SEMrushRelatedKeyphrases />
						</Fill>
					}
				</SidebarItem>
			}
			<SidebarItem key="google-preview" renderPriority={ 9 }>
				<GooglePreview />
			</SidebarItem>
			{ isReadabilityAnalysisActive &&
				<SidebarItem key="readability-analysis" renderPriority={ 10 }>
					<ReadabilityAnalysis />
				</SidebarItem>
			}
			{ isSeoAnalysisActive &&
				<SidebarItem key="seo-analysis" renderPriority={ 20 }>
					<SeoAnalysis
						shouldUpsell={ settings.shouldUpsell }
						shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
					/>
				</SidebarItem>
			}
			{ settings.isCornerstoneActive &&
				<SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CornerstoneContent cornerstoneContentInfoLink={ wpseoAdminL10n[ "shortlinks.cornerstone_content_info" ] } />
				</SidebarItem>
			}
			{ settings.displayAdvancedTab &&
				<SidebarItem key="advanced" renderPriority={ 40 }>
					<AdvancedSettings />
				</SidebarItem>
			}
			{ settings.displaySchemaSettings &&
				<SidebarItem key="schema" renderPriority={ 50 }>
					<SchemaTabContainer />
				</SidebarItem>
			}
			<SidebarItem key="social" renderPriority={ -1 }>
				<SocialMetadataPortal target="wpseo-section-social" />
			</SidebarItem>
		</Fragment>
	);
};

export default Metabox;
