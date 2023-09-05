import {Router} from 'express'
import ProductManager from'../ProductM.js'

const router = Router()


const producto = new ProductManager('./productos.json')

//GET
router.get('/', async(req, res) => {

    const prod =  await producto.getProducts()
    const limit = req.query.limit
    if(!limit) return res.send(prod)
    res.send(prod.slice(0,limit))
})

// GET /api/products
router.get('/:pid', async(req, res) => {
    const id = parseInt(req.params.pid)
    const prod =  await producto.getProductById(id)

    if(!prod) return res.status(404).send({error: 'No se encuentra el producto'})
    res.send(prod)
})

//POST
router.post('/', async(req, res) => {
    let payload = req.body
    if(!payload.code) {
        return res.status(400).send({status: 'error', message: 'El campo \'code\' es requerido'})
    }

    try {
        const newProduct = await producto.addProducts(payload)
        res.send(newProduct)
    } catch (error) {
        if (error.message && error.code) {
            res.status(400)
                .send({
                    status: 'error',
                    message: error.message,
                });
        } else {
            throw error;
        }
    }
    //res.status(200).send({prod})
})

//PUT
router.put('/:pid', async(req, res) =>{
    const pid = parseInt(req.params.pid)
    const payload = req.body
    const product = await producto.updateProduct(pid, payload)
    res.send(product)
})

//DELETE
router.delete('/:pid', async(req, res) =>{
    const pid = parseInt(req.params.pid)
    res.send({status: "Success", message: await producto.deleteProduct(pid)})
})

export default router