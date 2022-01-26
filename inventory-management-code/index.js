const initialInventory = {
  savingCost: 10,
  holdingCost: 1,
  penaltyCost: 2,
  minimumInventory: 3,
  maxStockAllowed: 10,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  orderFlatValueConstant: 2,
  perItemOrderCost: 4,
  demands: [5, 2, 8, 6, 2],
};

let modifiedInventory = {
  holdingCost: 0,
  penaltyCost: 0,
  orderCost: 0,
  totalRevenue: [],
  salesRevenue: 0,
  finalRevenue: 0,
  orderedItems: 0,
  inventory: 10,
};

for (let i = 0; i < initialInventory.days.length; i++) {
  let { orderedItems, inventory } = modifiedInventory;
  let {
    days,
    savingCost,
    minimumInventory,
    maxStockAllowed,
    perItemOrderCost,
    demands,
    orderFlatValueConstant,
  } = initialInventory;

  modifiedInventory.penaltyCost = 0;

  // calculate penalty cost
  if (modifiedInventory.inventory < demands[i]) {
    modifiedInventory.penaltyCost =
      (demands[i] - inventory) * initialInventory.penaltyCost;
  }

  // calculate sales revenue
  modifiedInventory.salesRevenue = Math.min(demands[i], inventory) * savingCost;

  // modify inventory
  modifiedInventory.inventory =
    inventory - demands[i] >= 0 ? inventory - demands[i] : 0;
  inventory = modifiedInventory.inventory;

  modifiedInventory.holdingCost = inventory * initialInventory.holdingCost;

  if (inventory < minimumInventory) {
    // handle orderedItems
    modifiedInventory.orderedItems = maxStockAllowed - inventory;
    orderedItems = modifiedInventory.orderedItems;

    // modify inventory
    modifiedInventory.inventory = inventory + orderedItems;
    inventory = modifiedInventory.inventory;

    // modify orderCost
    modifiedInventory.orderCost =
      orderedItems > 0
        ? orderedItems * perItemOrderCost + orderFlatValueConstant
        : 0;
  }

  // calculate this day total revenue
  const modifiedTotalRevenue =
    modifiedInventory.salesRevenue -
    modifiedInventory.holdingCost -
    modifiedInventory.orderCost -
    modifiedInventory.penaltyCost;

  // push this day total revenue
  modifiedInventory.totalRevenue.push(modifiedTotalRevenue);

  // reset inventory
  modifiedInventory = {
    holdingCost: 0,
    penaltyCost: 0,
    orderCost: 0,
    totalRevenue: modifiedInventory.totalRevenue,
    salesRevenue: 0,
    finalRevenue: modifiedInventory.totalRevenue.reduce((a, b) => a + b),
    orderedItems: 0,
    inventory,
  };

  console.log(
    `final Inventory after ${days[i]}`,
    JSON.parse(JSON.stringify(modifiedInventory))
  );
}
