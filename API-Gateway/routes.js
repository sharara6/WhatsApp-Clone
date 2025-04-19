const ROUTES = [
    {
        url: '/video-compression',
        auth: false,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 5
        },
        proxy: {
            target: "http://localhost:8080",
            changeOrigin: true,
            pathRewrite: {
                [`^/video-compression`]: '',
            },
        }
    },
    {
        url: '/image-compression',
        auth: true,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 10
        },
        proxy: {
            target: "http://localhost:8081",
            changeOrigin: true,
            pathRewrite: {
                [`^/image-compression`]: '',
            },
        }
    }
]

exports.ROUTES = ROUTES;