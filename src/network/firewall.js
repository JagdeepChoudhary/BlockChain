import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export class Security {
    static middleware() {
        return [
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'"],
                        styleSrc: ["'self'", "'unsafe-inline'"]
                    }
                },
                hsts: {
                    maxAge: 63072000,
                    includeSubDomains: true,
                    preload: true
                }
            }),
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100,
                standardHeaders: true,
                legacyHeaders: false
            })
        ];
    }

    static sanitize(input) {
        if (typeof input !== 'object') return input;

        return Object.entries(input).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string'
                ? value.replace(/[^a-zA-Z0-9]/g, '')
                : value;
            return acc;
        }, {});
    }
}