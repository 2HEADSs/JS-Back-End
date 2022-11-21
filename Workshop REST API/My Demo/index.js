const express = require('express')

const products = [
    {
        id: 'asdf1',
        name: 'Product 1',
        price: 110
    },
    {
        id: 'asdf2',
        name: 'Product 2',
        price: 75
    },
    {
        id: 'asdf3',
        name: 'Product 3',
        price: 32
    },
]

const app = express();

app.use(express.static('static'));
app.use(express.json())

app.get('/data', (req, res) => {
    res.json(products)
})

app.post('/data', (req, res) => {
    const record = {
        id: ('000000' + (Math.random() * 999999 | 0)).slice(-6),
        name: req.body.name,
        price: Number(req.body.price)
    }
    products.push(record)
    res.status(201).json(record)
});

app.delete('/data/:id', (req, res) => {
    const itemIndex = products.findIndex(x => x.id == req.params.id)
    products.splice(itemIndex, 1)
    res.status(202).end()
})

app.listen(3000, console.log('Start on localhost 3000'))