const client = require('prom-client')
const register = new client.Registry()
client.collectDefaultMetrics({ register })

const requestCounter = new client.Counter({
    name: 'request_count',
    help: 'Total number of requests',
    labelNames: ['method', 'route'],
})
const responesTimeHistogram = new client.Histogram({
    name: 'request_duration_seconds',
    help: 'Duration of http requests',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 3, 5]
})
const errorCount = new client.Counter({
    name: 'http_request_errors_total',
    help: 'Total number of failed HTTP requests',
    labelNames: ['method', 'route', 'status_code']
})
const dbQueryDuration = new client.Histogram({
    name: 'db_query_duration_seconds',
    help: 'DB query latency in seconds',
    labelNames: ['query']
})

register.registerMetric(requestCounter)
register.registerMetric(responesTimeHistogram)
register.registerMetric(errorCount)
register.registerMetric(dbQueryDuration)
module.exports = {
    register,
    requestCounter,
    responesTimeHistogram,
    errorCount,
    dbQueryDuration
}