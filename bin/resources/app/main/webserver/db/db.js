var mongoDB;
module.exports = function(mongoose) {
    if(mongoDB) return mongoDB;
    mongoDB = mongoose.connect("mongodb://localhost:27017/react_db");
    mongoDB.connection.on("error", function (error) {
        console.log("数据库连接失败：" + error);
    });
    mongoDB.connection.on("open", function () {
        console.log("数据库连接成功！", mongoDB);
    });
    return mongoDB;
};