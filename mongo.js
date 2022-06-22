(async () => {
  try{
  const { MongoClient,ObjectId } = require('mongodb');
  const url = 'mongodb://18.141.196.195:27017';
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to server');
  const db = await client.db("sapomanager");
  const list = await db.collection('orders').aggregate([{
    "$lookup": {
      "from": "lineitems",
      "localField": "id",
      "foreignField": "order_id",
      "as": "lineitems"
  }
  },{
    "$unwind": "$lineitems" ,
  }, {
      "$match": { "created_at": { "$lt": new Date("2022-04-28T00:00:00.000") } }
  }]);

  for await (const variable of list) {
    //console.log("variable.id",variable.id,"id",variable.lineitems.id);
    await db.collection('lineitems').updateOne({
      order_id: variable.id,
      id: variable.lineitems.id
    },{
      $set: {
          machine_id: ObjectId('620f99dcaaa9bfb17fcceb25'),
          status: "DONE"
      }
    });
  }

  await db.collection('orders').updateMany({
    created_at: { "$lt":  new Date("2022-04-28T00:00:00.000") }
  },{
    $set: {
        status: "DONE"
    }
  });
}catch(e){
  console.log("error",e);
}
})()