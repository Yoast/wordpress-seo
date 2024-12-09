import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Link, Modal as BaseModal } from "@yoast/ui-library";
import { ExternalLinkIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { YoastIcon } from "./YoastIcon";

/**
 * The modal component with header and footer links.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {Function} onClose The function to call when the modal is closed.
 * @param {string} insightsLink The links to the insights.
 * @param {string} learnMoreLink The link to the learn more page.
 * @param {JSX.node} children The content of the modal.
 *
 * @returns {JSX.Element} The modal component.
 */
export const Modal = ( { isOpen, onClose, insightsLink, learnMoreLink, children } ) => {
	return (
		<BaseModal
			onClose={ onClose }
			isOpen={ isOpen }
		>
			<BaseModal.Panel className="yst-p-0 yst-max-w-2xl">
				<BaseModal.Container.Header className="yst-flex yst-gap-3 yst-p-6 yst-border-b-slate-200 yst-border-b yst-flex-row">
					<YoastIcon />
					<BaseModal.Title as="h3" className="yst-text-lg yst-font-medium">
						{ __( "Related keyphrases", "wordpress-seo" ) }
					</BaseModal.Title>
				</BaseModal.Container.Header>
				<BaseModal.Container.Content
					className="yst-related-keyphrase-modal-content yst-m-0"
				>
					{ children }
				</BaseModal.Container.Content>
				<BaseModal.Container.Footer className="yst-p-6 yst-border-t yst-border-t-slate-200 yst-flex yst-justify-between">
					<Link
						href={ insightsLink }
						className="yst-modal-footer-link"
						target="_blank"
					>
						{ sprintf(
						/* translators: %s expands to Semrush */
							__( "Get more insights at %s", "wordpress-seo" ),
							"Semrush",
						) }
						<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
						<ExternalLinkIcon className="yst-link-icon rtl:yst-rotate-[270deg]" />
					</Link>
					<Link
						href={ learnMoreLink }
						className="yst-modal-footer-link yst-text-primary-500"
						target="_blank"
					>
						{ __( "Learn more about the metrics", "wordpress-seo" ) }
						<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
						<ArrowNarrowRightIcon className="yst-link-icon rtl:yst-rotate-180" />
					</Link>
				</BaseModal.Container.Footer>
			</BaseModal.Panel>
		</BaseModal>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	insightsLink: PropTypes.string.isRequired,
	learnMoreLink: PropTypes.string.isRequired,
	children: PropTypes.node,
};
