import { useState, useCallback, useEffect, createPortal } from "@wordpress/element";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import AnalysisCheck from "../components/AnalysisCheck";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import { colors } from "@yoast/style-guide";
import SvgIcon from "@yoast/components/src/SvgIcon";
import { LinkButton, NewBadge } from "@yoast/components";

/**
 * Portal which places the sidebar in the body.
 *
 * @param {object} props The props.
 *
 * @returns { React.ReactPortal } The portal.
 */
const SidebarPortal = ( props ) => {
	return createPortal(
		props.children,
		document.body
	);
};

/**
 * The Frontend Modal.
 *
 * @param {object} props Functional Component props.
 *
 * @returns {*} The SeoAnalysisModal.
 */
const FrontendSidebar = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( localStorage.getItem( "wpseoFrontSidebarOpen" ) === "open" );

	/**
	 * Toggles a class on the body to make space for the sidebar when it's open.
	 * Toggles an item on local storage which keeps track if the sidebar is open or not.
	 */
	useEffect(
		() => {
			const wpseoFrontSidebarOpen = isOpen ? "open" : "closed";
			localStorage.setItem( "wpseoFrontSidebarOpen", wpseoFrontSidebarOpen );
			if ( isOpen ) {
				document.body.classList.add( "wpseoFrontSidebarOpen" );
			} else {
				document.body.classList.remove( "wpseoFrontSidebarOpen" );
			}
		},
		[ isOpen ]
	);
	const toggleSidebar = useCallback( () => setIsOpen( ! isOpen ), [ isOpen ] );
	const seoScore = getIndicatorForScore( props.data.seoScore );
	const readabilityScore = getIndicatorForScore( props.data.readabilityScore );

	/**
	 * Element to render when value is empty.
	 *
	 * @returns {wp.Element} The element.
	 */
	const Empty = () => {
		return <em>{ __( "<none>", "wordpress-seo" ) }</em>;
	};

	return (
		<Fragment>
			<a
				href="#wpseoFrontSidebar"
				onClick={ toggleSidebar }
			>
				{ __( "Inspect", "wordpress-seo" ) }
				{ " " }
				<NewBadge />
			</a>
			<SidebarPortal>
				{ isOpen &&
				<aside id="wpseoFrontSidebar">
					<header>
						<h2><YoastIcon />{ __( "SEO Inspector", "wordpress-seo" ) }</h2>
						<button className="close" onClick={ toggleSidebar }>
							<SvgIcon icon="times" color={ colors.$color_grey_text } />
						</button>
					</header>
					{ props.data.isEditable && <section>
						<h3>{ __( "Focus Keyphrase", "wordpress-seo" ) }</h3>
						{ props.data.focusKeyphrase || <Empty /> }
						<div className="checks">
							<h3>{ __( "Checks", "wordpress-seo" ) }</h3>
							<AnalysisCheck
								label={ __( "SEO score", "wordpress-seo" ) + ":" }
								score={ seoScore.className || "not-set" }
								scoreValue={ seoScore.screenReaderReadabilityText || __(  "not analyzed", "wordpress-seo" ) }
							/>
							<AnalysisCheck
								label={ __( "Readability score", "wordpress-seo" )  + ":" }
								score={ readabilityScore.className || "not-set" }
								scoreValue={ readabilityScore.screenReaderReadabilityText || __( "not analyzed", "wordpress-seo" ) }
							/>
						</div>
						{ props.data.editButton && <Fragment>
							<br />
							<LinkButton href={ props.data.editButton.href }><SvgIcon icon="edit" color={ colors.$color_grey_text } /> { props.data.editButton.text }</LinkButton>
						</Fragment> }
					</section> }
					<section>
						<h3>{ __( "Meta tags", "wordpress-seo" ) }</h3>
						<ul>
							{ props.data.metaTags.map( item => <li key={ item.key }><strong>{ item.key }</strong><br />{ item.val }</li> ) }
						</ul>
					</section>
					<section>
						<h3>{ __( "Schema", "wordpress-seo" ) }</h3>
						<ReactJson
							src={ props.data.schema }
							collapsed={ 3 }
							displayDataTypes={ false }
							displayObjectSize={ false }
							indentWidth={ 2 }
						/>
					</section>
				</aside>
				}
			</SidebarPortal>
		</Fragment>
	);
};

FrontendSidebar.propTypes = {
	data: PropTypes.object.isRequired,
};

export default FrontendSidebar;
