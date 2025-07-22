const fastify = require('fastify')({
    logger: true,
});
const db = require('./db');
const bcrypt = require('bcrypt');
const fastifyCookie = require('fastify-cookie');
const fastifyCors = require('@fastify/cors');

fastify.register(fastifyCookie, {
  secret: 'supersecretkey',
  parseOptions: {}
});

const ORIGIN = 'http://localhost:5173'; // where React runs
fastify.register(fastifyCors, {
  origin: ORIGIN,
  credentials: true, // allow cookies to be sent
});

const PORT = 3000;

const checkAdmin = async (req, reply) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return reply.status(401).send({ error: 'Not authenticated' });
  }

  let sessionData;
  try {
    // verify & unsign cookie
    sessionData = req.unsignCookie(sessionCookie);

    if (!sessionData.valid) {
      throw new Error('Invalid cookie');
    }

    const { userId, isAdmin } = JSON.parse(sessionData.value);

    if (!isAdmin) {
      return reply.status(403).send({ error: 'Admin access required' });
    }

    req.user = { id: userId, isAdmin };

  } catch {
    return reply.status(401).send({ error: 'Invalid session' });
  }
};


fastify.get('/api/products', (req, res) => {    
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    res.send(products);
});

fastify.post('/api/products', { preHandler: checkAdmin }, async (req, res) => {
    const { name, price, stock } = req.body;

    if (name == null || price == null || stock == null) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    const insert = db.prepare(`
        INSERT INTO products (name, price, stock)
        VALUES (?, ?, ?)
    `);
    const result = insert.run(name, price, stock);

    return res.send({ id: result.lastInsertRowid, name, price, stock });
});

fastify.put('/api/products/:id', { preHandler: checkAdmin }, async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    // Validate id
    if (!id) {
        return res.status(400).send({ error: 'Missing product ID' });
    }

    if (!name && price == null && stock == null) {
        return res.status(400).send({ error: 'At least one field (name, price, stock) is required to update' });
    }

    // Build dynamic query parts
    const fields = [];
    const values = [];

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }
    if (price != null) {
        fields.push('price = ?');
        values.push(price);
    }
    if (stock != null) {
        fields.push('stock = ?');
        values.push(stock);
    }

    values.push(id);  // for WHERE id=?

    try {
        const update = db.prepare(`
            UPDATE products SET ${fields.join(', ')} WHERE id = ?
        `);
        const result = update.run(...values);

        if (result.changes === 0) {
            return res.status(404).send({ error: 'Product not found' });
        }

        // Return updated product
        const select = db.prepare('SELECT * FROM products WHERE id = ?');
        const updatedProduct = select.get(id);

        res.send(updatedProduct);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update product', details: err.message });
    }
});

fastify.delete('/api/products/:id', { preHandler: checkAdmin }, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ error: 'Missing product ID' });
  }

  try {
    const del = db.prepare('DELETE FROM products WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.send({ message: `Product with id ${id} deleted successfully.` });
  } catch (err) {
    res.status(500).send({ error: 'Failed to delete product', details: err.message });
  }
});

fastify.post('/api/orders', async (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ error: 'Missing user_id or items array' });
  }

  // Validate items format
  for (const item of items) {
    if (
      typeof item.product_id !== 'number' ||
      typeof item.quantity !== 'number' ||
      item.quantity <= 0
    ) {
      return res.status(400).send({ error: 'Each item must have product_id and quantity > 0' });
    }
  }

  try {
    // Check stock for each product
    for (const item of items) {
      const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(item.product_id);
      if (!product) {
        return res.status(400).send({ error: `Product with id ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).send({
          error: `Not enough stock for product id ${item.product_id}. Available: ${product.stock}, requested: ${item.quantity}`
        });
      }
    }

    // insert order + items, update stock
    const insertOrder = db.prepare('INSERT INTO orders (user_id) VALUES (?)');
    const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    const transaction = db.transaction((userId, orderItems) => {
      const orderResult = insertOrder.run(userId);
      const orderId = orderResult.lastInsertRowid;

      for (const item of orderItems) {
        insertOrderItem.run(orderId, item.product_id, item.quantity);
        updateStock.run(item.quantity, item.product_id);
      }

      return orderId;
    });

    const orderId = transaction(user_id, items);

    return res.send({ message: 'Order created', order_id: orderId });
  } catch (err) {
    return res.status(500).send({ error: 'Failed to create order', details: err.message });
  }
});

fastify.get('/api/orders', { preHandler: checkAdmin }, async (req, res) => {
  try {
    // Get all orders
    const orders = db.prepare('SELECT * FROM orders').all();

    // For each order, fetch items
    const getItems = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?');

    const ordersWithItems = orders.map(order => {
      const items = getItems.all(order.id);
      return {
        id: order.id,
        user_id: order.user_id,
        created_at: order.created_at,
        items,
      };
    });

    return res.send(ordersWithItems);
  } catch (err) {
    return res.status(500).send({ error: 'Failed to fetch orders', details: err.message });
  }
});


fastify.post('/api/register', async (req, res) => {
  const { name, password } = req.body;
  // console.log(req.body);

  if (!name || !password) {
    return res.status(400).send({ error: 'Name and password are required' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = db.prepare(`
      INSERT INTO users (name, password, is_admin)
      VALUES (?, ?, ?)
    `);

    const result = insertUser.run(name, hashedPassword, 0);

    return res.status(201).send({ id: result.lastInsertRowid, name });
  } catch (err) {
      console.error('Register error:', err);
      return res.status(500).send({ error: 'Failed to register user', details: err.message });
  }
});


fastify.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).send({ error: 'Name and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);

    if (!user) {
      // User not found
      return res.send({ authenticated: false, isAdmin: false });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.send({ authenticated: false, isAdmin: false });
    }

    return res
        .setCookie('session', JSON.stringify({ userId: user.id, isAdmin: user.is_admin }), {
            path: '/',
            httpOnly: true, // cookie not accessible via client JS
            secure: false, // set true if HTTPS
            signed: true,
            maxAge: 60 * 60 * 24 // 1 day
        })
        .send({ authenticated: true, isAdmin: Boolean(user.is_admin) });
  } catch (err) {
    return res.status(500).send({ error: 'Login failed', details: err.message });
  }
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();