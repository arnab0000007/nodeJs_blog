const {
    body
} = require('express-validator')
const cheerio = require('cheerio')
module.exports = [
    body('tags')
    .not().isEmpty().withMessage('Tags Can Not Be Emoty').trim(),
    body('title')
    .not().isEmpty().withMessage('Title Can Not Be Empty').isLength({
        max: 100
    }).withMessage('Title Can not Be greater than 100 Chars')
    .trim(),
    body('body')
    .not().isEmpty().withMessage('Body Can not Be Empty')
    .custom(value=>{
        let node = cheerio.load(value)
        let text = node.text()
        if (text.length>5000) {
            throw new Error('Body Can Not Be Greater Than 5000 Chars')
        }
        return true
    }),
    
]