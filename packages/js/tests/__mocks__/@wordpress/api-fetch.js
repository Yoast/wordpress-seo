const apiFetch = jest.fn();
apiFetch.use = jest.fn();
module.exports = apiFetch;
