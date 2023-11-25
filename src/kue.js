/*const kue =require('kue') ;
const db = require('./models');
var queue = kue.createQueue({
    prefix: 'q',
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        auth: process.env.REDIS_PASSWORD
    }
});

var init= () => {
        queue.process('img-upload', function (job, done) {
            Promise.all([
                db.productphoto.bulkCreate(job.data.attachmentEntries),
                db.productphoto.destroy({
                    where: {
                        id: job.data.productId
                    }
                })
            ])
            .then(r => {
                done(true);
            })
            .catch(err => {
                console.log('error - ' + err);
                done(false);
            })
        });

    }


module.exports={queue,init};*/



