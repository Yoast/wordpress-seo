import { useState, useCallback, useEffect, createPortal } from "@wordpress/element";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import styled from "styled-components";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import AnalysisCheck from "../components/AnalysisCheck";

const SidebarPortal = ( props ) => {
	return createPortal(
		props.children,
		document.body
	)
}

/**
 * The Frontend Modal.
 *
 * @param {object} props Functional Component props.
 *
 * @returns {*} The SeoAnalysisModal.
 */
const FrontendSidebar = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( localStorage.getItem("wpseoFrontSidebarOpen" ) === "open" );

	const toggleSidebar = useEffect(
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
	const closeSidebar = useCallback( () => setIsOpen( false ), [] );
	const openSidebar = useCallback( () => setIsOpen( true ), [] );
	const seoScore = getIndicatorForScore( props.data.seoScore );
	const readabilityScore = getIndicatorForScore( props.data.readabilityScore );
	const Empty = () => { return <em>{ __( "<none>", "wordpress-seo" ) }</em>; }

	return (
		<Fragment>
			<a
				onClick={ openSidebar }
				className={ `${ props.classes.openButton }` }
			>
				{ __( "Inspect", "wordpress-seo" ) }
			</a>
			<SidebarPortal>
				{ isOpen &&
				<div className="wpseoFrontSidebar">
					<h2>{ __( "Yoast Inspector", "wordpress-seo" ) }</h2>
					<a class="close" onClick={ closeSidebar }>[Close]</a>
					<hr />
					<h3>{ __("Focus Keyphrase", "wordpress-seo") }</h3>
					<div>{ props.data.focusKeyphrase || <Empty /> }</div>
					<div class="checks">
						<h3>{ __("Checks", "wordpress-seo") }</h3>
						<AnalysisCheck
							label={ __("SEO score", "wordpress-seo") }
							score={ seoScore.className }
							scoreValue={ seoScore.screenReaderReadabilityText }
						/>
						<AnalysisCheck
							label={ __("Readability score", "wordpress-seo") }
							score={ readabilityScore.className }
							scoreValue={ readabilityScore.screenReaderReadabilityText }
						/>
					</div>
					<hr />
					<h3>{ __("Internal Links on this page", "wordpress-seo") }</h3>
					{
						props.data.links.outgoing.length > 0 && <ul>
							{ props.data.links.outgoing.map( item => <li key={ item.id }><a href={ item.href }>{ item.title }</a></li> ) }
						</ul>
					}
					{ props.data.links.outgoing.length === 0 && <Empty /> }
					<h3>{ __("Pages on your site linking here", "wordpress-seo") }</h3>
					{
						props.data.links.incoming.length > 0 && <ul>
							{ props.data.links.incoming.map( item => <li key={ item.id }><a href={ item.href }>{ item.title }</a></li> ) }
						</ul>
					}
					{ props.data.links.incoming.length === 0 && <Empty /> }
					<hr />
					<h3>{ __("Canonical", "wordpress-seo") }</h3>
					<div>{ props.data.canonical }</div>
					<h3>{ __("SEO Title", "wordpress-seo") }</h3>
					<div>{ props.data.title }</div>
					<h3>{ __("Meta Description", "wordpress-seo") }</h3>
					<div>{ props.data.metaDescription || <Empty /> }</div>
					<h3>{ __("Robots meta", "wordpress-seo") }</h3>
					<div>{ props.data.robots }</div>
					<h3>{ __("Schema", "wordpress-seo") }</h3>
					<div><ReactJson src={ props.data.schema } collapsed={ 3 } /></div>
					<hr />
					<h3>{ __("Tools", "wordpress-seo") }</h3>
					<ul>
						{ props.data.analysisTools.map( item => <li key={ item.id }><a href={ item.href }>{ item.title }</a></li> ) }
					</ul>
				</div>
				}
			</SidebarPortal>
		</Fragment>
	);
};

FrontendSidebar.propTypes = {
	classes: PropTypes.shape( {
		openButton: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ),
	data: PropTypes.object.isRequired,
	className: PropTypes.string,
};

FrontendSidebar.defaultProps = {
	openButtonIcon: "",
	classes: {},
};

export default FrontendSidebar;
