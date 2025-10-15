import { useSelect, useDispatch } from "@wordpress/data";
import { useMemo, useCallback } from "@wordpress/element";
import PrePublish from "../components/PrePublish";
import {
	maybeAddReadabilityCheck,
	maybeAddFocusKeyphraseCheck,
	maybeAddSEOCheck,
	maybeAddInclusiveLanguageCheck,
} from "../helpers/addCheckToChecklist";
import { shouldShowAiGenerateCheck } from "../helpers/addAiGenerateToChecklist";

/**
 * PrePublish container using hooks for optimized performance.
 *
 * @returns {JSX.Element} PrePublish component with checklist and actions.
 */
const PrePublishContainer = () => {
	const yoastStore = useSelect( ( select ) => select( "yoast-seo/editor" ), [] );

	const checklist = useMemo( () => {
		const items = [];
		maybeAddFocusKeyphraseCheck( items, yoastStore );
		maybeAddSEOCheck( items, yoastStore );
		maybeAddReadabilityCheck( items, yoastStore );
		maybeAddInclusiveLanguageCheck( items, yoastStore );
		items.push( ...Object.values( yoastStore.getChecklistItems() ) );
		return items;
	}, [ yoastStore ] );

	const showAiGenerateCheck = useMemo( () => shouldShowAiGenerateCheck( yoastStore ), [ yoastStore ] );

	const { closePublishSidebar, openGeneralSidebar } = useDispatch( "core/edit-post" );
	const onClick = useCallback( () => {
		closePublishSidebar();
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
	}, [ closePublishSidebar, openGeneralSidebar ] );

	return (
		<PrePublish
			checklist={ checklist }
			showAiGenerateCheck={ showAiGenerateCheck }
			onClick={ onClick }
		/>
	);
};

export default PrePublishContainer;
