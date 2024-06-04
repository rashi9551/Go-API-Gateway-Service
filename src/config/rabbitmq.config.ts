import 'dotenv/config'

export default {
    rabbitMQ:{
        url:String(process.env.RabbitMqUrl)
    },
    queues:{
        dirverQueue:"driver_queue",
        rideQueue:"ride-queue",
    }
}