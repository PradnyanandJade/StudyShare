// import mysql2 from 'mysql2/promise';

// let db;
// async function connectDB(){
//     try {
//         db = await mysql2.createConnection({
//             host:'localhost',
//             user:'root',
//             password:'jade#2004',
//             database:'Backend'
//         });
//         console.log('Database Connection Successful !');
//     } catch (error) {
//         console.error('Database Connection Failed !'+ error);
//     }
// }

// await connectDB();

// export default db;


// import mysql2 from 'mysql2';

// const db = await mysql2.createConnection({
//             host:'localhost',
//             user:'root',
//             password:'jade#2004',
//             database:'Backend'
// });

// db.connect((err)=>{
//     if(err){
//         console.error("Database connection failed: " + err.stack);
//         return;
//     }
//     console.log("Database Connected!");
// })

// export default db;


// config/db.js
import mysql2 from 'mysql2/promise';

const db = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'jade#2004',
  database: 'Backend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("✅ Database Connected (Promise API)");

export default db;
