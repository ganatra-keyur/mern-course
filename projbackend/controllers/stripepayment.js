const stripe = require("stripe")(
  "sk_test_51LKPcISAsWPMV9ckfPfgllF16KrT1If8OnsY7PcCWiSKxQGsOLQL8KLCEe2f0Q5UKbdJ0Tm3ToxedChRXwVkZmv600boRTv659"
);
const { v4: uuidv4 } = require("uuid");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS: ", products);

  //finding total amount
  let amount = 0;
  products.map((product) => {
    amount = amount + product.price;
  });

  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.paymentIntents
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "A Test Account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
