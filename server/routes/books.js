const express = require("express");
const router = express.Router();
const db = require("../model/data");
const ret = require("../lib/return");

router.post("/search", async (req, res) => {
    try{
        const {title, authors} = req.body;
        if( title.length > 0 ) {
            const AllBooks = await db.Book.findAll({ include: [{model:db.Author}]});
            const booksData = await AllBooks.map(book => book.dataValues);// get books' id name isbn authors
            const filteredBooks1 = await booksData.map(mappedbook => {// filter books that includes requested name or authors
            mappedbook.Authors = mappedbook.Authors.map( author=> author.dataValues.name).join(", ");
                if(mappedbook.title.includes(title) || mappedbook.Authors.includes(authors)) {
                    return mappedbook;
                } 
                else return undefined;// no matched result
            })
            const filteredBooks2 = await filteredBooks1.filter(item => item !== undefined); //item in filtered array is undefined
            ret.json( filteredBooks2, res);
        } else { res.json(undefined) }; // req.body is empty
    } 
    catch {res.status(400).json('Wrong Input')}
})


router.post("/add", async(req, res) => {
    try {
        const {title, isbn, authors} = req.body;
        if( title.length > 0 ) {
            const book1 = await db.Book.create({ title: title, isbn: isbn});
            const namesArray = await authors.split(', '); // put authors into an array
            await namesArray.forEach(async name => {
                let author1 = await db.Author.findOrCreate({where:{name: name }});
                await book1.addAuthor(author1[0]); // map authors' array and add to the book
            });
            res.json("Successfully Added");
        } else { res.status(400).json("wrong information")};
    }
    catch {res.status(400).json("Failed to add") };
});


router.delete("/delete", async(req, res) => {
    const {id, isbn} = req.body;
    const book = await db.Book.findByPk(id);
    if (book && book.dataValues.isbn === isbn) { 
        await book.destroy();
    } else {
        res.status(400).json("Not found");
    }
    res.json('successfully deleted');
});

module.exports = router;
