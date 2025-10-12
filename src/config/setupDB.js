const connect = require('./connectdb');

(async () => {
    await connect();
    console.log("Collections have been created successfully!");
    process.exit(0); // thoát sau khi xong
})();