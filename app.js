// Beers on tap names and price
const beverages =
    [
        { name: 'Beer', price: 45 },
        { name: 'Cider', price: 52 },
        { name: 'Premix', price: 59 }
    ];

let currentTab = [];

/// Created a reusable button component //DOM
function createButton(text, onClick) {

    const button = document.createElement('button');
    button.textContent = text; //reusable, making it change text dependant on button
    button.addEventListener('click', onClick);

    return button;
}

// created a reusable input component
function createInput(type, id, value) {

    const input = document.createElement('input');

    input.type = type;
    input.id = id;
    input.value = value;

    return input;
}

// This functions shows the drinks available
function displayBeverages() {

    const beveragesList = document.getElementById('beverages-list');

    beveragesList.innerHTML = '<h2>Beers on tap:</h2>';

    beverages.forEach(beverage => {
        beveragesList.innerHTML += `<p>${beverage.name}: R${beverage.price}</p>`;
    });
}

// This function creats the order inputs
function createOrderInputs() {

    const orderInputs = document.getElementById('order-inputs');
    orderInputs.innerHTML = '';
    beverages.forEach(beverage => {
        const label = document.createElement('label');
        label.textContent = beverage.name;
        const input = createInput('number', `${beverage.name.toLowerCase()}-quantity`, 0); //suffix to create a meaningful identifier for an input field,
        input.min = 0;

        orderInputs.appendChild(label);
        orderInputs.appendChild(input);
        orderInputs.appendChild(document.createElement('br'));
    });
}



// This function adds the orders to the tab
function addToTab() {

    const order = beverages.map(beverage => ({
        name: beverage.name,
        quantity: parseInt(document.getElementById(`${beverage.name.toLowerCase()}-quantity`).value),
        price: beverage.price
    })).filter(item => item.quantity > 0);

    currentTab = currentTab.concat(order);
    updateBillSummary();

    // resetts input fields
    beverages.forEach(beverage => {
        document.getElementById(`${beverage.name.toLowerCase()}-quantity`).value = 0;
    });
}

// Updates tghe bills summary
function updateBillSummary() {

    const totalAmount = currentTab.reduce((total, item) => total + item.quantity * item.price, 0);
    document.getElementById('total-amount').textContent = `Total: R${totalAmount.toFixed(2)}`;
}

// Calculates the split bill
function calculateSplitBill() {

    const splitNumber = parseInt(document.getElementById('split-number').value);
    const totalAmount = currentTab.reduce((total, item) => total + item.quantity * item.price, 0);
    const perPersonAmount = totalAmount / splitNumber;

    document.getElementById('per-person-amount').textContent = `Amount per person: R${perPersonAmount.toFixed(2)}`;
}

// This function allows an CSV export
function exportTabAsCSV() {

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Beverage,Quantity,Price,Total\n";

    currentTab.forEach(item => {
        csvContent += `${item.name},${item.quantity},${item.price},${item.quantity * item.price}\n`;
    });

    const splitNumber = parseInt(document.getElementById('split-number').value);
    csvContent += `\nSplit Between,,,${splitNumber.toFixed(2)}`;

    const totalAmount = currentTab.reduce((total, item) => total + item.quantity * item.price, 0);
    csvContent += `\nSum Total,,,R${totalAmount.toFixed(2)}`;

    const perPersonAmount = totalAmount / splitNumber;
    csvContent += `\nSplit Amount Each,,,R${perPersonAmount.toFixed(2)}`;


    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "barTab.csv");
    document.body.appendChild(link);

    link.click();
}

// initialises the app
function init() {

    displayBeverages();
    createOrderInputs();

    document.getElementById('add-to-tab').addEventListener('click', addToTab);
    document.getElementById('calculate-split').addEventListener('click', calculateSplitBill);
    document.getElementById('export-tab').addEventListener('click', exportTabAsCSV);
}

// Runs the app - scripts loads and makes everything ready immediately
init();