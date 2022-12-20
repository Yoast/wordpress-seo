/* eslint-disable complexity */
import { ArrowLeftIcon as PureArrowLeftIcon, ArrowRightIcon as PureArrowRightIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Modal, Spinner, Title, useRootContext, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { times } from "lodash";
import { Helmet } from "react-helmet";
import { ASYNC_ACTION_STATUS, INTRODUCTION_VIDEO_FLOW } from "../constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The Introduction modal.
 */
const Introduction = () => {
	const videoFlow = useSelectSettings( "selectIntroductionVideoFlow" );
	const showIntroduction = useSelectSettings( "selectIntroductionShowValue" );
	const wistiaEmbedPermission = useSelectSettings( "selectIntroductionWistiaEmbedPermission" );
	const pluginUrl = useSelectSettings( "selectPreference", [], "pluginUrl", "" );
	const { setIntroductionVideoFlow, setIntroductionWistiaEmbedPermission, setIntroductionShow } = useDispatchSettings();
	const [ isOpen, , , , setClose ] = useToggleState( showIntroduction );
	const [ stepIndex, setStepIndex ] = useState( 0 );
	const [ video, setVideo ] = useState( null );
	const svgAriaProps = useSvgAria();
	const { isRtl } = useRootContext();
	const ArrowLeftIcon = useMemo( () => isRtl ? PureArrowRightIcon : PureArrowLeftIcon, [ isRtl ] );
	const ArrowRightIcon = useMemo( () => isRtl ? PureArrowLeftIcon : PureArrowRightIcon, [ isRtl ] );

	const steps = useMemo( () => ( [
		{
			title: __( "We gave our settings a new look!", "wordpress-seo" ),
			description: __( "We've updated, and comprehensively improved how our interfaces look, feel, and behave.", "wordpress-seo" ),
			videoId: "c1fpikf45l",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb0.jpg`,
				width: "960",
				height: "540",
			},
		},
		{
			title: __( "Improved discoverability of our features", "wordpress-seo" ),
			description: __( "We've added a new sidebar menu in which we carefully restructured all settings.", "wordpress-seo" ),
			videoId: "cxojwh5z3w",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb1.jpg`,
				width: "960",
				height: "540",
			},
		},
		{
			title: __( "Easily find the setting you're looking for", "wordpress-seo" ),
			description: __( "We've added a search function that lets you quickly find all settings and navigate directly to them!", "wordpress-seo" ),
			videoId: "cq3yge9yjb",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb2.jpg`,
				width: "960",
				height: "540",
			},
		},
	] ), [ pluginUrl ] );
	const isOnFirstStep = useMemo( () => stepIndex === 0, [ stepIndex ] );
	const isOnLastStep = useMemo( () => stepIndex === steps.length - 1, [ stepIndex, steps ] );

	const playVideo = useCallback( () => setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.playing ), [ setIntroductionVideoFlow ] );

	const handleNext = useCallback( () => setStepIndex( stepIndex + 1 ), [ stepIndex, setStepIndex ] );
	const handlePrevious = useCallback( () => setStepIndex( stepIndex - 1 ), [ stepIndex, setStepIndex ] );
	const handleRequestPlay = useCallback( () => {
		if ( wistiaEmbedPermission.value ) {
			playVideo();
		} else {
			setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.askPermission );
		}
	}, [ wistiaEmbedPermission.value, setIntroductionVideoFlow ] );
	const handleDenyEmbed = useCallback( () => setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.showPlay ), [ setIntroductionVideoFlow ] );
	const handleAllowEmbed = useCallback( () => {
		setIntroductionWistiaEmbedPermission( true );
		playVideo();
	}, [ setIntroductionWistiaEmbedPermission, playVideo ] );
	const handleClose = useCallback( () => {
		setIntroductionShow( false );
		setClose();
	}, [ setIntroductionShow, setClose ] );

	useEffect( () => {
		if ( videoFlow !== INTRODUCTION_VIDEO_FLOW.playing ) {
			return;
		}
		if ( video === null ) {
			window._wq = window._wq || [];
			window._wq.push( {
				id: steps[ stepIndex ].videoId,
				onReady: newVideo => setVideo( newVideo ),
			} );
			return;
		}
		video.replaceWith( steps[ stepIndex ].videoId );
	}, [ videoFlow, stepIndex, steps, setVideo ] );

	return (
		<Modal onClose={ handleClose } isOpen={ isOpen }>
			<div className="yst-modal__panel yst-max-w-[37rem] yst-p-0 yst-rounded-2xl sm:yst-rounded-3xl">
				{ wistiaEmbedPermission.value && <Helmet>
					<script src={ "https://fast.wistia.com/assets/external/E-v1.js" } async={ true } />
				</Helmet> }
				<div className="yst-relative">
					<div className="yst-absolute yst-inset-0 yst-bg-gradient-to-b yst-from-primary-200" />
					<div className="yst-relative yst-pt-6 sm:yst-pt-8 yst-pb-8 yst-px-4 sm:yst-px-8">
						<div className="yst-relative yst-w-full yst-h-0 yst-pt-[56.25%] yst-overflow-hidden yst-rounded-lg yst-shadow-md">
							{ videoFlow === INTRODUCTION_VIDEO_FLOW.showPlay && (
								<button className="yst-absolute yst-inset-0 yst-button yst-p-0 yst-border-none" onClick={ handleRequestPlay }>
									{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
									<img className="yst-w-full yst-h-auto" { ...steps[ stepIndex ].thumbnail } />
								</button>
							) }
							{ videoFlow === INTRODUCTION_VIDEO_FLOW.askPermission && (
								<div className="yst-absolute yst-inset-0 yst-flex yst-flex-col yst-items-center yst-justify-center yst-bg-white">
									<p className="yst-max-w-xs yst-mx-auto yst-text-center">
										{ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading && <Spinner /> }
										{ wistiaEmbedPermission.status !== ASYNC_ACTION_STATUS.loading && sprintf(
											/* translators: %1$s expands to Yoast SEO. %2$s expands to Wistia. */
											__( "To see this video, you need to allow %1$s to load embedded videos from %2$s.", "wordpress-seo" ),
											"Yoast SEO",
											"Wistia"
										) }
									</p>
									<div className="yst-flex yst-mt-6 yst-gap-x-4">
										<Button
											type="button"
											variant="secondary"
											onClick={ handleDenyEmbed }
											disabled={ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading }
										>
											{ __( "Deny", "wordpress-seo" ) }
										</Button>
										<Button
											type="button"
											variant="primary"
											onClick={ handleAllowEmbed }
											disabled={ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading }
										>
											{ __( "Allow", "wordpress-seo" ) }
										</Button>
									</div>
								</div>
							) }
							{ wistiaEmbedPermission.value && videoFlow === INTRODUCTION_VIDEO_FLOW.playing && (
								<div className="yst-absolute yst-w-full yst-h-full yst-top-0 yst-left-0">
									{ video === null && <Spinner className="yst-h-full yst-mx-auto" /> }
									<div
										className={ `wistia_embed wistia_async_${ steps[ stepIndex ].videoId } videoFoam=true` }
									/>
								</div>
							) }
						</div>
					</div>
				</div>
				<div className="yst-relative yst-flex yst-flex-col yst-mt-2 yst-mb-8 yst-mx-4 sm:yst-mx-8 yst-text-center">
					<Title as="h2" size="2">
						{ steps[ stepIndex ].title }
					</Title>
					<Modal.Description className="yst-max-w-xs yst-mx-auto yst-mt-2">
						{ steps[ stepIndex ].description }
					</Modal.Description>
					<ul className="yst-flex yst-mt-10 sm:yst-mt-8 yst-gap-5 yst-justify-center yst-items-center">
						{ times( steps.length ).map( ( index ) => (
							<li
								key={ `step-circle-${ index }` }
								className={ classNames(
									"yst-inline-block yst-rounded-full",
									index === stepIndex ? "yst-w-2.5 yst-h-2.5 yst-bg-primary-500" : "yst-w-2 yst-h-2 yst-bg-primary-200"
								) }
							/>
						) ) }
					</ul>
					<div className="yst-flex yst-gap-2 yst-mt-6">
						{ ! isOnFirstStep && <Button type="button" variant="secondary" onClick={ handlePrevious }>
							<ArrowLeftIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-mr-1 yst-text-slate-400" { ...svgAriaProps } />
							{ __( "Back", "wordpress-seo" ) }
						</Button> }
						<div className="yst-flex-grow" />
						{ ! isOnLastStep && <button
							type="button"
							className="yst-button yst-shadow-none yst-text-primary-500 yst-bg-white yst-border-none hover:yst-text-primary-900 visited:yst-text-primary-900 visited:hover:yst-text-primary-900"
							onClick={ handleClose }
						>
							{ __( "Skip", "wordpress-seo" ) }
						</button> }
						{ ! isOnLastStep && <Button type="button" variant="primary" onClick={ handleNext }>
							{ __( "Next", "wordpress-seo" ) }
							<ArrowRightIcon className="yst-w-4 yst-h-4 yst-ml-1 yst--mr-1" { ...svgAriaProps } />
						</Button> }
						{ isOnLastStep && <Button type="button" variant="primary" onClick={ handleClose }>
							{ __( "Got it!", "wordpress-seo" ) }
						</Button> }
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Introduction;
