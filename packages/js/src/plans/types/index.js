/**
 * @typedef {Object} UpsellConfig
 * @property {string} action The name of the buy action.
 * @property {string} ctbId The ID of the click-to-buy.
 */

/**
 * @typedef {Object} AddOn
 * @property {string} id The unique identifier of the add-on.
 * @property {string} name The name of the add-on.
 * @property {boolean} isActive Whether the add-on is activated (and thus also installed).
 * @property {boolean} hasLicense Whether the add-on is licensed.
 * @property {UpsellConfig} upsellConfig The configuration for the upsell action.
 */
