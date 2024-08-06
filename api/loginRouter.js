const express = require('express');
const session = require('express-session');
var loginRouter = express.Router()
const bcrypt = require('bcrypt');
const path = require('path');
// const secretGenerator = require('./public/secretGenerator');
const multer = require('multer');
// // const fs = require('fs');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

var config = require("./databaseConfig.js")
var conn = config.connection
// change: 
// 1. body-parser -> express
// 2. db -> conn
// 3. /login -> /
// 4. 首頁 / -> /home 

// unchange
// 1. passport的路徑
// 2. google登入的路徑
// 3. secretGenerator檔案上傳到專案並改引用路徑

loginRouter.set('view engine', 'ejs');
loginRouter.set('views', path.join(__dirname, 'views'));

loginRouter.use(express.urlencoded({ extended: true }));
loginRouter.use(express.json());

// --------測試路由用----------
// http://localhost:3200/login
loginRouter.get('/', function (req, res) { res.send('OK') })

// http://localhost:3200/login/test
loginRouter.get('/test', function (req, res) {
    const conn = req.app.get('connection')
    conn.query("SELECT * FROM member WHERE uid = 1", function (err, result) { res.json(result) })
})
// --------測試路由用----------



// // 設置 session
// let secret;
// const secretFile = 'session_secret.txt';
// secret = secretGenerator.readSecretFromFile(secretFile);
// if (!secret) {
//     secret = secretGenerator.generateSecret();
//     secretGenerator.saveSecretToFile(secret, secretFile);
// }

loginRouter.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 設置 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')  // 確保此目錄存在
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });
// // 首頁
loginRouter.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            userName: req.session.userName,
            userType: req.session.userType
        });
    } else {
        res.render('index', {
            userName: null,
            userType: null
        });
    }
});

// 登入頁面
loginRouter.get('/', (req, res) => {
    res.render('login', { error: null });
});

// 註冊頁面
loginRouter.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// 註冊
loginRouter.post('/register', upload.fields([
    { name: 'logo_img', maxCount: 1 },
    { name: 'brand_img', maxCount: 5 }
]), (req, res) => {
    // console.log('收到註冊請求:', req.body);

    const { user_type, account, email, password, confirm_password, first_name, last_name, phone, address, tw_id } = req.body;

    const logo_img = req.files['logo_img'] ? req.files['logo_img'][0].path : null;
    const brand_img01 = req.files['brand_img01'] ? req.files['brand_img01'][0].path : null;
    const brand_img02 = req.files['brand_img02'] ? req.files['brand_img02'][0].path : null;
    const brand_img03 = req.files['brand_img03'] ? req.files['brand_img03'][0].path : null;
    const brand_img04 = req.files['brand_img04'] ? req.files['brand_img04'][0].path : null;
    const brand_img05 = req.files['brand_img05'] ? req.files['brand_img05'][0].path : null;


    // 詳細驗證
    let errors = [];

    if (!account || !/^[a-zA-Z0-9]{8,12}$/.test(account)) {
        errors.push('帳號至少需要 8 個字符');
    }

    if (!password || !/^[a-zA-Z0-9!@#$%^&*()]{8,12}$/.test(password)) {
        errors.push('密碼需要 8~12 個字符');
    }

    if (password !== confirm_password) {
        errors.push('密碼和確認密碼不相同');
    }

    if (user_type === 'member') {
        if (!first_name || !/^[\u4e00-\u9fa5]+$/.test(first_name)) {
            errors.push('名字只能填寫中文');
        }

        if (!last_name || !/^[\u4e00-\u9fa5]+$/.test(last_name)) {
            errors.push('姓氏只能填寫中文');
        }

        if (!tw_id || !/^[A-Z](1|2)\d{8}$/.test(tw_id)) {
            errors.push('請輸入台灣身分證字號');
        }

        if (!phone || !/^09\d{8}$/.test(phone)) {
            errors.push('請輸入手機號碼');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('請輸入電子信箱地址');
        }

        if (!address) {
            errors.push('地址為必填項目');
        }
    } else if (user_type === 'vendor') {
        // 攤販特定驗證
        const { brand_name, brand_type } = req.body;
        if (!brand_name) {
            errors.push('品牌名稱為必填項目');
        }

    }

    // 檢查所有欄位是否包含空格
    if (/\s/.test(account + password + first_name + last_name + phone + tw_id)) {
        errors.push('欄位不能包含空格');
        console.log('欄位包含空格');
    }

    if (errors.length > 0) {
        console.log('驗證錯誤:', errors);
        return res.status(400).json({ success: false, error: errors });
    }

    console.log('所有驗證通過');

    // 檢查帳號是否已存在
    const checkAccountQuery = 'SELECT * FROM member WHERE account = ? OR email = ? UNION SELECT * FROM vendor WHERE account = ? OR email = ?';
    conn.query(checkAccountQuery, [account, email, account, email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: '數據庫錯誤，請稍後再試' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, error: '此帳號已存在' });
        }

        // 密碼加密
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.render('register', { error: '密碼錯誤，請稍後再試' });
            }


            if (user_type === 'vendor') {
                const { brand_name, brand_type, content, fb, ig, web } = req.body;

                const logo_img = req.files['logo_img'] ? req.files['logo_img'][0].path : '';
                const brand_imgs = req.files['brand_img'] ? req.files['brand_img'].map(file => file.path) : [];
                // 確保有 5 個品牌圖片路徑，如果不足則填充空字串
                while (brand_imgs.length < 5) {
                    brand_imgs.push('');
                }

                const insertVendorInfoQuery = `
                INSERT INTO vendor_info 
                (brand_name, brand_type, logo_img, brand_img01, brand_img02, brand_img03, brand_img04, brand_img05, content, fb, ig, web) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                conn.query(insertVendorInfoQuery, [
                    brand_name, brand_type, logo_img, brand_imgs[0], brand_imgs[1], brand_imgs[2], brand_imgs[3], brand_imgs[4],
                    content, fb || '', ig || '', web || ''
                ], (err, infoResult) => {
                    if (err) {
                        console.error('攤販資訊註冊錯誤:', err);
                        return res.status(500).json({ success: false, error: '攤販註冊錯誤，請稍後再試' });
                    }

                    const vinfoId = infoResult.insertId;

                    // 註冊攤主，包括 vinfoId
                    const insertVendor = 'INSERT INTO vendor (account, password, first_name, last_name, phone, address, email, tw_id, vinfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({ success: false, error: '密碼加密錯誤，請稍後再試' });
                        }

                        conn.query(insertVendor, [account, hash, first_name, last_name, phone, address, email, tw_id, vinfoId], (err, vendorResult) => {
                            if (err) {
                                console.error('攤販註冊錯誤:', err);
                                // 如果 vendor 插入失敗，我們應該刪除剛才插入的 vendor_info 記錄
                                conn.query('DELETE FROM vendor_info WHERE vinfo = ?', [vinfoId], (deleteErr) => {
                                    if (deleteErr) console.error('刪除失敗的 vendor_info 記錄時出錯:', deleteErr);
                                });
                                return res.status(500).json({ success: false, error: '攤販註冊錯誤，請稍後再試' });
                            }

                            console.log('攤販註冊成功:', account);
                            res.json({ success: true, message: '註冊成功' });
                        });
                    });
                });
            } else {
                // 一般會員註冊
                const insertMemberQuery = 'INSERT INTO member (account, password, first_name, last_name, phone, address, email, tw_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                conn.query(insertMemberQuery, [account, hash, first_name, last_name, phone, address, email, tw_id], (err, result) => {
                    if (err) {
                        console.error('會員註冊錯誤:', err);
                        return res.status(500).json({ success: false, error: '會員註冊錯誤，請稍後再試' });
                    }
                    console.log('會員註冊成功:', account);
                    res.json({ success: true, message: '註冊成功' });
                });
            }
        });
    });
});


// 登入
loginRouter.post('/login', (req, res) => {
    const { account, password, userType } = req.body;
    console.log(`收到 ${userType} 類型的登入請求，帳號：`, account);

    const table = userType === 'member' ? 'member' : 'vendor';
    const query = `SELECT * FROM ${table} WHERE account = ? OR email = ?`;

    conn.query(query, [account, account], (err, results) => {
        if (err) {
            console.error(`查詢 ${table} 表時發生數據庫錯誤:`, err);
            return res.status(500).json({ error: '伺服器錯誤' });
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) {
                    console.error('比較密碼時發生錯誤:', err);
                    return res.status(500).json({ error: '內部伺服器錯誤' });
                }
                if (isMatch) {
                    req.session.loggedin = true;
                    req.session.userName = results[0].account;
                    req.session.userType = userType;
                    console.log(`${userType} 登入成功:`, results[0].account);
                    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                        return res.json({
                            success: true,
                            userType: userType,
                            userName: results[0].account,
                            vendorName: userType === 'vendor' ? req.session.vendorName : null
                        });
                    } else {
                        // 對於非 AJAX 請求，直接重定向
                        return res.redirect('/');
                    }

                } else {
                    console.log(`${userType} 密碼錯誤:`, account);
                    return res.status(401).json({ success: false, error: '帳號或密碼錯誤' });
                }
            });
        }
        else {
            console.log('找不到帳號:', account);
            return res.status(401).json({ success: false, error: '帳號或密碼錯誤' });
        }
    });
});



// 登出
loginRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('登出時發生錯誤:', err);
            return res.status(500).send('登出失敗');
        }
        res.redirect('/');
    });
});

loginRouter.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer 錯誤
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, error: `上傳錯誤: ${err.message}` });
    } else if (err) {
        // 其他錯誤
        console.error('Server error:', err);
        return res.status(500).json({ success: false, error: '伺服器錯誤' });
    }
    next();
});


module.exports = loginRouter