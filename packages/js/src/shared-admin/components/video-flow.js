/* eslint-disable complexity */
import { useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Spinner } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { ASYNC_ACTION_STATUS, VIDEO_FLOW } from "../constants";

/**
 * Video with permission and thumbnail.
 * @param {string} videoId The video to show.
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {Object} wistiaEmbedPermission The value, status and set for the Wistia embed permission.
 * @returns {JSX.Element} The element.
 */
export const VideoFlow = ( { videoId, thumbnail, wistiaEmbedPermission } ) => {
	const [ videoFlow, setVideoFlow ] = useState( wistiaEmbedPermission.value ? VIDEO_FLOW.isPlaying : VIDEO_FLOW.showPlay );

	const playVideo = useCallback( () => setVideoFlow( VIDEO_FLOW.isPlaying ), [ setVideoFlow ] );

	// Requesting play is either playing the video or asking embed permission.s
	const handleRequestPlay = useCallback( () => {
		if ( wistiaEmbedPermission.value ) {
			playVideo();
		} else {
			setVideoFlow( VIDEO_FLOW.askPermission );
		}
	}, [ wistiaEmbedPermission.value, playVideo, setVideoFlow ] );

	// Denying embed permission leads back to showing the thumbnail.
	const handleDenyEmbed = useCallback( () => setVideoFlow( VIDEO_FLOW.showPlay ), [ setVideoFlow ] );

	// Allowing embed permission: store the permission and play the video.
	const handleAllowEmbed = useCallback( () => {
		wistiaEmbedPermission.set( true );
		playVideo();
	}, [ wistiaEmbedPermission.set, playVideo ] );

	return (
		<>
			{ wistiaEmbedPermission.value && (
				<Helmet>
					<script src={ "https://fast.wistia.com/assets/external/E-v1.js" } async={ true } />
				</Helmet>
			) }
			<div className="yst-relative yst-w-full yst-h-0 yst-pt-[56.25%] yst-overflow-hidden yst-rounded-md yst-drop-shadow-md yst-bg-white">
				{ videoFlow === VIDEO_FLOW.showPlay && (
					<button
						type="button"
						className="yst-absolute yst-inset-0 yst-button yst-p-0 yst-border-none yst-bg-white yst-transition-opacity yst-duration-1000 yst-opacity-100"
						onClick={ handleRequestPlay }
					>
						<img
							className="yst-w-full yst-h-auto"
							alt=""
							loading="lazy"
							decoding="async"
							{ ...thumbnail }
						/>
					</button>
				) }
				{ videoFlow === VIDEO_FLOW.askPermission && (
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
				{ ( wistiaEmbedPermission.value && videoFlow === VIDEO_FLOW.isPlaying ) && (
					<div className="yst-absolute yst-w-full yst-h-full yst-top-0 yst-right-0">
						{ videoId === null && <Spinner className="yst-h-full yst-mx-auto" /> }
						{ videoId !== null && <div className={ `wistia_embed wistia_async_${ videoId } videoFoam=true` } /> }
					</div>
				) }
			</div>
		</>
	);
};
VideoFlow.propTypes = {
	videoId: PropTypes.string.isRequired,
	thumbnail: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		width: PropTypes.string,
		height: PropTypes.string,
	} ).isRequired,
	wistiaEmbedPermission: PropTypes.shape( {
		value: PropTypes.bool.isRequired,
		status: PropTypes.string.isRequired,
		set: PropTypes.func.isRequired,
	} ).isRequired,
};
