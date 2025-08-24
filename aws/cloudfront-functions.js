// CloudFront Function for API proxy
// This function should be attached to CloudFront distribution as a viewer request function

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Proxy API requests to backend
    if (uri.startsWith('/api/')) {
        request.origin = {
            custom: {
                domainName: '3.36.49.60',
                port: 8080,
                protocol: 'http',
                path: ''
            }
        };
        return request;
    }
    
    // Handle SPA routing - serve index.html for non-API routes
    if (!uri.includes('.') && uri !== '/') {
        request.uri = '/index.html';
    }
    
    return request;
}