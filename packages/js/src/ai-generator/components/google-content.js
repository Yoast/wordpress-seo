import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ModeSwitcher } from "@yoast/search-metadata-previews";
import { GooglePreview, GooglePreviewSkeleton, LengthProgressBar } from ".";
import { ASYNC_ACTION_STATUS, EDIT_TYPE, STORE_NAME_EDITOR } from "../constants";
import { useLocation, useTitleOrDescriptionLengthProgress, useTypeContext } from "../hooks";

/**
 * @param {string} title The title.
 * @param {string} description The description.
 * @param {string} status The fetch status.
 * @param {string} titleForLength The title for the length calculation (no separator or site name).
 * @param {boolean} showPreviewSkeleton Whether to show the preview skeleton or the actual preview.
 * @param {boolean} showLengthProgress Whether to show the actual progress or 0.
 * @returns {JSX.Element} The element.
 */
export const GoogleContent = ( { title, description, status, titleForLength, showPreviewSkeleton, showLengthProgress } ) => {
	const initialMode = useSelect( select => select( STORE_NAME_EDITOR ).getSnippetEditorMode(), [] );
	const [ mode, setMode ] = useState( initialMode );
	const { editType } = useTypeContext();
	const location = useLocation();
	const lengthProgress = useTitleOrDescriptionLengthProgress( { editType, title: titleForLength, description } );
	return (
		<>
			<ModeSwitcher
				onChange={ setMode }
				active={ mode }
				id={ `yst-ai-google-preview-mode-switcher-${ location }` }
				mobileModeInputId={ `yst-ai-mode__mobile__${ location }` }
				desktopModeInputId={ `yst-ai-mode__desktop__${ location }` }
				disabled={ status === ASYNC_ACTION_STATUS.loading }
			/>
			{ showPreviewSkeleton
				? <GooglePreviewSkeleton />
				: <GooglePreview mode={ mode } title={ title } description={ description } />
			}
			<div className="yst-pt-4">
				<Label as="span" className="yst-flex-grow yst-cursor-default">
					{ editType === EDIT_TYPE.title ? __( "SEO title width", "wordpress-seo" ) : __( "Meta description length", "wordpress-seo" ) }
				</Label>
				<LengthProgressBar
					className="yst-mt-2"
					progress={ showLengthProgress ? lengthProgress.actual : 0 }
					min={ 0 }
					max={ lengthProgress.max }
					score={ lengthProgress.score }
				/>
			</div>
		</>
	);
};
GoogleContent.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	status: PropTypes.oneOf( Object.keys( ASYNC_ACTION_STATUS ) ).isRequired,
	titleForLength: PropTypes.string.isRequired,
	showPreviewSkeleton: PropTypes.bool.isRequired,
	showLengthProgress: PropTypes.bool.isRequired,
};
