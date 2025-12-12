import { ExclamationIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Code, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useSelectSettings } from "../hooks";

/**
 * The modal when the Schema is programmaticaly disabled with the filter.
 *
 * @param {Object} props The props.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {function} [props.onClose] The function to call when the modal is closed.
 * @returns {JSX.Element} The modal.
 */
export const SchemaProgrammaticallyDisabledModal = ( { isOpen, onClose = noop } ) => {
	const svgAriaProps = useSvgAria();
	const learnMoreFilterLink = useSelectSettings( "selectLink", [], "https://developer.yoast.com/features/schema/api/" );

	const description = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/*
			 * translators: %1$s expands to `wpseo_json_ld_output`, %2$s expands to `false`,
			 * %3$s and %4$s are replaced by opening and closing <a> tags
			 */
			__( "The %1$s filter has been set to %2$s or an empty array, which turns off Schema output. %3$sLearn more about the filter%4$s.", "wordpress-seo" ),
			"<code1 />",
			"<code2 />",
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ learnMoreFilterLink } target="_blank" rel="noopener noreferrer" />,
			code1: <Code>wpseo_json_ld_output</Code>,
			code2: <Code>false</Code>,
		}
	), [ learnMoreFilterLink ] );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<Modal.Panel className="yst-max-w-lg">
				<div className="yst-flex yst-flex-col yst-items-center sm:yst-flex-row sm:yst-items-start sm:yst-columns-2 yst-gap-4">
					<div
						className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0"
					>
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-text-center sm:yst-text-left">
						<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
							{ __( "Yoast Schema Framework can't be enabled", "wordpress-seo" ) }
						</Modal.Title>
						<Modal.Description className="yst-text-sm yst-text-slate-500">
							{ description }
						</Modal.Description>
					</div>
				</div>
				<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
					<Button type="button" variant="primary" onClick={ onClose } className="yst-w-full sm:yst-w-auto">
						{ __( "Got it", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal> );
};

SchemaProgrammaticallyDisabledModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
};
