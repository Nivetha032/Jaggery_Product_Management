
import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";
 
const app = express();

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//product
const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload1 = multer({
    storage: storage1
})
// end imag eupload 

router.post('/add_product', upload.single('image'), (req, res) => {
    console.log("Product Data:", JSON.stringify(req.body));  // This will log the product details properly.
    const sql = `INSERT INTO product 
    (name, price, description, quantity, stock, expiry_date, image, category_id) 
    VALUES (?)`;
    
    bcrypt.hash(req.body.description, 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        const values = [
            req.body.name,
            req.body.price,
            hash,
            req.body.quantity, 
            req.body.stock, 
            req.body.expiry_date, 
            req.file.filename,
            req.body.category_id
        ];
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Status: false, Error: err });
            return res.json({ Status: true });
        });
    });
});


router.get('/product', (req, res) => {
    const sql = "SELECT * FROM product";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM product WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})
router.put('/edit_product/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        UPDATE product
        SET name = ?, price = ?, quantity = ?, category_id = ?, stock = ?
        WHERE id = ?
    `;

    const values = [
        req.body.name,
        req.body.price,
        req.body.quantity,
        req.body.category_id,
        req.body.stock,
        id // Ensure this matches the product ID in the URL
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).json({ Status: false, Error: "Query Error: " + err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "Product not found or no changes made" });
        }

        return res.json({ Status: true, Message: "Product updated successfully" });
    });
});


// Delete a product by ID
router.delete('/delete_product/:id', (req, res) => {
    const id = req.params.id;

    // Prepare the SQL query
    const sql = "DELETE FROM product WHERE id = ?";

    // Execute the query
    con.query(sql, [id], (err, result) => {
        if (err) {
            // Return an error response if there was a query error
            console.error("Query Error:", err);
            return res.status(500).json({ Status: false, Error: "Query Error: " + err.message });
        }
        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "Product not found" });
        }
        // Return a success response
        res.status(200).json({ Status: true, Message: "Product deleted successfully", Result: result });
    });
});



//end product

//order

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload2 = multer({ storage: storage2 });

// Add a new order
router.post('/add_orders', upload2.single('image'), (req, res) => {
    const sql = `INSERT INTO \`order\` 
    (name, number, email, method, flat, street, city, state, country, pin_code, total_products, total_price) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        req.body.name,
        req.body.number,
        req.body.email,
        req.body.method,
        req.body.flat,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.country,
        req.body.pin_code,
        req.body.total_products,
        req.body.total_price
    ];
    
    // Execute the query
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    });
});

// Get all orders
router.get('/orders', (req, res) => {
    const sql = "SELECT * FROM `order`";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get an order by ID
router.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM `order` WHERE order_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Edit an order
router.put('/edit_orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        UPDATE \`order\`
        SET name = ?, number = ?, email = ?, method = ?, flat = ?, street = ?, city = ?, state = ?, country = ?, pin_code = ?, total_products = ?, total_price = ?, status=?
        WHERE order_id = ?
    `;

    const values = [
        req.body.name,
        req.body.number,
        req.body.email,
        req.body.method,
        req.body.flat,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.country,
        req.body.pin_code,
        req.body.total_products,
        req.body.total_price,
        req.body.status,
    ];

    con.query(sql, [...values, id], (err, result) => {
        if (err) {
            console.error("Query Error:", err); // Log the detailed error
            return res.status(500).json({ Status: false, Error: "Query Error: " + err.message });
        }

        if (result.affectedRows === 0) {
            // If no rows were affected, it could mean the order ID doesn't exist.
            return res.status(404).json({ Status: false, Error: "Order not found or no changes made" });
        }

        return res.json({ Status: true, Message: "Order updated successfully" });
    });
});

// Delete an order
router.delete('/delete_orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `order` WHERE order_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});



//end order




router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/product_count', (req, res) => {
    const sql = "select count(id) as product from product";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err });
        return res.json({ Status: true, Result: result });
    });
});


router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/order_count', (req, res) => {
    const sql = "SELECT SUM(total_price) AS total_order_price FROM `order`"; // Adjusted table name
    con.query(sql, (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: `Query Error: ${err.message}` });
        }
        return res.json({ Status: true, Result: result });
    });
});

router.get('/ordertot_count', (req, res) => {
    const sql = "select count(id) as order from order";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


router.get('/order_status_count', (req, res) => {
    const sql = `
        SELECT order_status, COUNT(order_id) AS order_count 
        FROM \`order\` 
        WHERE order_status IN ('Delivered', 'Pending') 
        GROUP BY order_status
    `;
    con.query(sql, (err, result) => {
        if (err) return res.json({Status: false, Error: "Query Error: " + err});
        return res.json({Status: true, Result: result});
    });
});






router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})



export { router as adminRouter };
