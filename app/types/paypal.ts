export type OrderDetails = {
  id: string;
  purchase_units: [
    {
      payments: {
        captures: [
          {
            amount: {
              value: string;
            };
          }
        ];
      };
    }
  ];
  payment_source?: {
    paypal?: {
      name?: {
        given_name?: string;
        surname?: string;
      };
    };
  };
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
};
