import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { GooglePreview, GooglePreviewSkeleton, LengthProgressBar, PreviewModePicker } from ".";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { ASYNC_ACTION_STATUS, EDIT_TYPE } from "../constants";
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
	const initialMode = useSelect( select => select( STORE_NAME_EDITOR.free ).getSnippetEditorMode(), [] );
	const [ mode, setMode ] = useState( initialMode );
	const { editType } = useTypeContext();
	const location = useLocation();
	const lengthProgress = useTitleOrDescriptionLengthProgress( { editType, title: titleForLength, description } );
	return (
		<>
			<div className="yst-mb-2 lg:yst-flex">
				<Label as="span" className="yst-flex-grow yst-cursor-default">
					{ __( "Google preview", "wordpress-seo-premium" ) }
				</Label>
				<PreviewModePicker
					mode={ mode }
					idSuffix={ location }
					onChange={ setMode }
					disabled={ status === ASYNC_ACTION_STATUS.loading }
				/>
			</div>
			{ showPreviewSkeleton
				? <GooglePreviewSkeleton />
				: <GooglePreview mode={ mode } title={ title } description={ description } />
			}
			<div className="yst-pt-4">
				<Label as="span" className="yst-flex-grow yst-cursor-default">
					{ editType === EDIT_TYPE.title && __( "SEO title width", "wordpress-seo-premium" ) }
					{ editType === EDIT_TYPE.description && __( "Meta description length", "wordpress-seo-premium" ) }
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
