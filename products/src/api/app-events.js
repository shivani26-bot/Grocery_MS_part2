// const ShoppingService = require("../services/shopping-service");

//webhook exposed to other services where they can call and put some data
module.exports = (app) => {
  // const service = new ShoppingService();
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    console.log(
      "============= Products Service received event ================"
    );
    console.log(payload);

    return res.status(200).json({ message: "notified!" });
  });
};
