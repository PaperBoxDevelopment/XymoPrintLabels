
const MongoClient = require('mongodb').MongoClient
const Parser = { useNewUrlParser: true, useUnifiedTopology: true }
let connect = (url, parser) => MongoClient.connect(url, parser).then(client => client.db())


module.exports = async () =>  await connect(process.env.ATLAS, Parser)
  
