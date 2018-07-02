import React from "react";

/**
 * Wraps a component with a store listener.
 *
 * @param {Object} store The store to subscribe to.
 *
 * @returns {Function} The function to wrap a component with a store listener.
 */
export default function listenToActiveKeyword( store ) {
	return ( WrappedComponent ) => {
		class ActiveKeywordWrapper extends React.Component {
			constructor( props ) {
				super( props );

				this.state = {
					activeKeyword: this.getActiveKeyword(),
				};

				this.handleStoreChange = this.handleStoreChange.bind( this );
			}

			/**
			 * Subscribe to the store.
			 *
			 * @returns {void}
			 */
			componentDidMount() {
				this._unsubscribe = store.subscribe( this.handleStoreChange );
			}

			/**
			 * Unsubscribe the store.
			 *
			 * @returns {void}
			 */
			componentWillUnmount() {
				this._unsubscribe();
			}

			/**
			 * Retrieves the active keyword from the store.
			 *
			 * @returns {string} The active keyword.
			 */
			getActiveKeyword() {
				return store.getState().activeKeyword;
			}

			/**
			 * Handles store changes.
			 *
			 * @returns {void}
			 */
			handleStoreChange() {
				const { activeKeyword: previousKeyword } = this.state;
				const activeKeyword = this.getActiveKeyword();

				if ( previousKeyword !== activeKeyword ) {
					this.setState( { activeKeyword } );
				}
			}

			render() {
				return (
					<WrappedComponent { ...this.state } { ...this.props } />
				);
			}
		}

		return ActiveKeywordWrapper;
	};
}
