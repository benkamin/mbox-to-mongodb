var Mbox = require ('node-mbox');
var simpleParser = require('mailparser').simpleParser;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/dbname", function(err, db) {

    var mbox = new Mbox('filename.mbox');
    var col = db.collection('importedEmails');

    mbox.on('message',function(msg) {
        simpleParser(msg, function(err, mail) {
            try {
                if (mail.from.value[0].address.includes('email@address.com')) {
                    mail.to.value.forEach(function (rec) {
                        col.updateOne({address: rec.address}, {$set: {name: rec.name}}, {upsert: true});
                        console.log(rec.address + ',' + rec.name);
                    });
                }
            }
            catch (e){
                console.log(e);
            }
        });
    });

});
