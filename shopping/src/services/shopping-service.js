const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }
  //added getCart
  // We're enhancing the cart functionality here in the shopping service because, in the future, for the shopping service, we may need to handle promo codes, payment-related details, and transactions. In such cases, if the user service is not reachable, we can still access the cart, order, and delivery information directly from the shopping service. That's why we're focusing on improving the cart functionality.

  async GetCart({ _id }) {
    const cartItems = await this.repository.Cart(_id);
    console.log("ci", cartItems);
    return FormateData(cartItems);
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  //added managecart, subscriveevent and getorderpayload
  // We need to create our own system because something will happen in the shopping service. For example, when an order is placed in the shopping service, the customer service also needs to be notified that a new order has been placed. This is where the publishing event section becomes crucial for this service. For that reason, we need to add a payload to handle this communication
  async ManageCart(customerId, item, qty, isRemove) {
    const cartResult = await this.repository.AddCartItem(
      customerId,
      item,
      qty,
      isRemove
    );
    return FormateData(cartResult);
  }

  async SubscribeEvents(payload) {
    console.log("payload", payload);
    payload = JSON.parse(payload); //added code
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };
      return payload;
      // return payload;
    } else {
      return FormateData({ error: "No Order Available" });
    }
  }
}

module.exports = ShoppingService;
