const db = require('./db');

const products = [
    { name: 'Salted Chips', price: 700, currency: 'HUF', stock: 6 },
    { name: 'Muesli bar', price: 300, currency: 'HUF', stock: 10 },
    { name: 'Pancake', price: 800, currency: 'HUF', stock: 3 },
    { name: 'Hot-Dog', price: 1500, currency: 'HUF', stock: 2 },
];

// Check if already seeded
const row = db.prepare('SELECT COUNT(*) AS count FROM products').get();
if (row.count === 0) {
    const insert = db.prepare(`
        INSERT INTO products (name, price, currency, stock)
        VALUES (@name, @price, @currency, @stock)
    `);

    const insertMany = db.transaction((items) => {
        for (const item of items) insert.run(item);
    });

    insertMany(products);
    console.log('Database seeded.');
} else {
    console.log('Products already exist, skipping seed.');
}