import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import ArrowNarrowRightIcon from "@heroicons/react/solid/ArrowNarrowRightIcon";
import ExternalLinkIcon from "@heroicons/react/outline/ExternalLinkIcon";
import { Button, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../../constants";
import { title } from "./messages/site-unreachable";
import { Paragraph } from "./messages/parts";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The "Learn more about connecting" paragraph shown by the two connect-aware
 * variants.
 *
 * @param {string} learnMoreUrl The MyYoast connection help URL.
 * @returns {JSX.Element} The element.
 */
const LearnMoreAboutConnecting = ( { learnMoreUrl = "" } ) => (
	<Paragraph>
		{ safeCreateInterpolateElement(
			sprintf(
				/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
				__( "%1$sLearn more about connecting with MyYoast.%2$s", "wordpress-seo" ),
				"<a>",
				"</a>"
			),
			{ a: <OutboundLink variant="error" href={ learnMoreUrl } /> }
		) }
	</Paragraph>
);
LearnMoreAboutConnecting.propTypes = { learnMoreUrl: PropTypes.string };

/**
 * Variant 1: MyYoast connection unavailable (flag off / not provisioned).
 * Informational only, nudging the user toward help rather than a connection.
 *
 * @returns {JSX.Element} The element.
 */
const UnavailableBody = () => {
	const svgAriaProps = useSvgAria();
	const { commonErrorsLink, supportLink } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			commonErrorsLink: editorSelect.selectLink( "https://yoa.st/ai-common-errors" ),
			supportLink: editorSelect.selectAdminLink( "?page=wpseo_page_support" ),
		};
	}, [] );

	return (
		<>
			<ModalDescription>
				<Paragraph>
					{ __( "This feature requires a publicly accessible site. Check that your site (including any password-protected REST APIs or test environments) is visible to the public, then try again.", "wordpress-seo" ) }
				</Paragraph>
			</ModalDescription>
			<Actions>
				<Button as="a" href={ supportLink } target="_blank" rel="noopener noreferrer" variant="secondary">
					{ __( "Still need help?", "wordpress-seo" ) }
					<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-4 yst-w-4 yst-text-slate-400 rtl:yst-rotate-[270deg]" { ...svgAriaProps } />
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
				<Button as="a" href={ commonErrorsLink } target="_blank" rel="noopener noreferrer" variant="primary">
					{ __( "Learn more", "wordpress-seo" ) }
					<ArrowNarrowRightIcon className="yst--me-1 yst-ms-1 yst-h-4 yst-w-4 rtl:yst-rotate-180" { ...svgAriaProps } />
				</Button>
			</Actions>
		</>
	);
};

/**
 * Picks the body for the site-unreachable modal based on the MyYoast connection
 * state.
 *
 * @param {Object} connection The MyYoast connection slice.
 * @param {function} onClose Dismisses the modal.
 * @param {Object} svgAriaProps The aria props for decorative SVGs.
 * @returns {JSX.Element} The body.
 */
const resolveBody = ( { isAvailable, canConnect, connectUrl, learnMoreUrl }, onClose, svgAriaProps ) => {
	// Variant 2: the site can be connected and the current user may do so.
	if ( isAvailable && canConnect && connectUrl ) {
		return (
			<>
				<ModalDescription>
					<Paragraph>
						{ __( "This feature requires a publicly accessible site. Connect to MyYoast to use Yoast AI even when your site is offline, behind a firewall, or with the REST API disabled.", "wordpress-seo" ) }
					</Paragraph>
					<LearnMoreAboutConnecting learnMoreUrl={ learnMoreUrl } />
				</ModalDescription>
				<Actions>
					<CloseButton onClose={ onClose } />
					{ /*
						* A plain link in a new tab: the Integrations page auto-starts the connection
						* there, so unsaved editor content is never lost to the OAuth redirect.
						*/ }
					<Button as="a" href={ connectUrl } target="_blank" rel="noopener noreferrer" variant="primary">
						{ __( "Connect to MyYoast", "wordpress-seo" ) }
						<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-4 yst-w-4 rtl:yst-rotate-[270deg]" { ...svgAriaProps } />
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
					</Button>
				</Actions>
			</>
		);
	}

	// Variant 3: the site can be connected, but not by this user.
	if ( isAvailable && ! canConnect ) {
		return (
			<>
				<ModalDescription>
					<Paragraph>
						{ __( "Your site isn't publicly accessible. Ask your site administrator to connect to MyYoast. They can find it on the Integrations page in Yoast SEO. This allows Yoast AI to work even when your site is offline, behind a firewall, or with the REST API disabled.", "wordpress-seo" ) }
					</Paragraph>
					<LearnMoreAboutConnecting learnMoreUrl={ learnMoreUrl } />
				</ModalDescription>
				<Actions>
					<CloseButton onClose={ onClose } />
				</Actions>
			</>
		);
	}

	// Variant 1: MyYoast connection unavailable (flag off / not provisioned).
	return <UnavailableBody />;
};

/**
 * The site-unreachable error (400 / SITE_UNREACHABLE) as a danger modal.
 *
 * Renders one of three variants based on the site's MyYoast connection state,
 * nudging the user to connect when it makes sense. Reads the connection data the
 * editor localizes; when it is unavailable (feature flag off or not provisioned)
 * it falls back to the informational-only variant.
 *
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const SiteUnreachableModal = ( { isOpen = true, onClose = noop } ) => {
	const svgAriaProps = useSvgAria();
	const connection = useSelect( select => select( STORE_NAME_AI ).selectMyyoastConnection(), [] );

	return (
		<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
			{ resolveBody( connection, onClose, svgAriaProps ) }
		</DangerModal>
	);
};
SiteUnreachableModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
