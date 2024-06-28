import 'dotenv/config'

export default {
    rabbitMQ:{
        url:String(process.env.RabbitMqUrl)
    },
    queues:{
        dirverQueue:"drivers_queue",
        rideQueue:'rides_queue'
    }
}