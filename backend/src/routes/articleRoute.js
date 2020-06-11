const router = require('express').Router();
const jwt = require('jsonwebtoken');

const {Article} = require('../models/articlemodel');

function isAuthenticated(req, res, next){
    const access_token = req.body.access_token;
    if(access_token){
        jwt.verify(access_token, process.env.SECRET_KEY, (err, value) => {
            if(err){
                return res.status(401).json({message: "Access Denied"});
            } else {
                console.log(value);
                req.userID = value.userID;
                next();
            }
        })
    } else {
        res.status(401).send("Access denied");
    }
}

router.post('/articles',isAuthenticated, async (req, res) => {
    console.log("in post articles...");
    const article = {
        title: req.body.title.trim(),
        body: req.body.body.trim(),
        author: req.body.author.trim(),
    };
    try{
        const newArticle = await Article.create(article);
        if(!newArticle){
            res.json('please try later')
        } else {
            res.status(201).json({statusCode: '201', body:{message: "new article created"}});
        }
    } catch(e) {
        console.log("error=", e);
        res.status(500).send('please try after some time');
    }
    
});

router.get('/articles', async (req, res) => {
    console.log(await Article.countDocuments().exec());
    let page = req.query.page ? parseInt(req.query.page) : 0, 
        limit = req.query.limit ? parseInt(req.query.limit) : await Article.countDocuments().exec(),
        startIndex =  ((page - 1) * limit) < 0 ? 0 : (page - 1) * limit,
        sortValue = req.query.sort == "desc" ? -1  : 1;
    
    console.log({page, limit, startIndex});

    try{
        const articlesList = await Article.find({}).skip(startIndex).limit(limit).sort({title: sortValue});
        // console.log({articlesList});
        res.json({
            statusCode: "200",
            body: {
                data: articlesList
            }
        })
    } catch(e) {
        console.log(" error in get articles=", e);
        res.status(500).send("please try again after some time")
    }
})

module.exports = router;