const db = require('./db');
const bcrypt = require('bcrypt');

// Example users (plain passwords will be hashed)
const users = [
    { name: 'admin', password: 'SnackBoss2025', is_admin: 1 },
    { name: 'user', password: 'password', is_admin: 0 },
];

const insert = db.prepare(`
    INSERT INTO users (name, password, is_admin)
    VALUES (@name, @password, @is_admin)
`);

(async () => {
    const existing = db.prepare(`SELECT COUNT(*) AS count FROM users`).get();
    if (existing.count === 0) {
        const insertMany = db.transaction((users) => {
            for (const user of users) {
                // Hash the password before storing
                user.password = bcrypt.hashSync(user.password, 10);
                insert.run(user);
            }
        });

        insertMany(users);
        console.log('Users seeded.');
    } else {
        console.log('Users already exist, skipping seed.');
    }
})();
