import '@testing-library/jest-dom'

if (typeof window !== 'undefined' && !window.fetch) {
    window.fetch = global.fetch;
    window.Headers = global.Headers;
    window.Request = global.Request;
    window.Response = global.Response;
}
