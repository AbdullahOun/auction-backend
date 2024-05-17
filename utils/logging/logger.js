const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            let logMessage = `${timestamp} [${level}]: ${message}`
            if (message instanceof Error) {
                logMessage = `${timestamp} [${level}]: ${message.message}\n${message.stack}`
            }

            if (Object.keys(meta).length) {
                logMessage += `\nmeta: ${JSON.stringify(meta, null, 2)}`
            }
            return logMessage
        })
    ),
    transports: [new winston.transports.Console()],
})

const expressWinstonConfig = {
    winstonInstance: logger,
    msg: 'HTTP {{req.method}} {{req.url}}',
    colorize: true,
    meta: true,
    expressFormat: true,
    requestFilter: (req, propName) => {
        if (propName === 'headers') {
            return {
                Authorization: req.headers['authorization']
                    ? 'present'
                    : 'missing',
            }
        } else if (
            ['url', 'originalUrl', 'httpVersion', 'method'].includes(propName)
        ) {
            return undefined
        }
        return req[propName]
    },
    responseFilter: (res, propName) => {
        return undefined
    },
}

module.exports = { expressWinstonConfig, logger }
