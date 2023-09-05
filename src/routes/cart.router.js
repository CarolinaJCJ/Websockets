import {Router} from 'express'
import CartManager from '../cartManager.js'
import ProductManager from '../ProductM.js'

const router = Router()
const carrito = new CartManager('./carrito.json')
const producto = new ProductManager('./productos.json')


//GET
router.get('/', async(req, res) => {
    const cart =  await carrito.getCarts()
    const limit = req.query.limit
    if(!limit) return res.send(cart)
    res.send(prod.slice(0,limit))
})

router.get('/:cid', async(req, res) => {
    const id = parseInt(req.params.cid)
    const cart =  await carrito.getCartById(id)
    if(!cart) return res.send({error: 'No se encuentra el carrito'})
    res.send(cart)
})

//POST
router.post('/', async(req, res) => {
    const cart = req.body
    //const id = parseInt(req.params.cid)
    res.send({status: "Sucess", messaje: await carrito.addCart(cart)})
})

//localhost:8080/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async(req, res) => {
    const id = parseInt(req.params.cid)
    const prod = parseInt(req.params.pid)
    const cart = await carrito.getCartById(id)
    const arrayProductos =  await producto.getProducts()
    let productoEncontrado = cart.products.findIndex(productos => productos.id === prod)
    if (productoEncontrado !== -1) {
        cart.products[productoEncontrado].quantity += 1 
        await carrito.updateCart(id, cart)
        return res.status(200).send({ statusbar: 'success', message: 'producto agregado'});
    }else{
        let prodExiste = arrayProductos.find(pd => pd.id === prod)
        if (!prodExiste) return res.send({error: 'No se encuentra el producto'})
        let producto ={}
        producto.id = prod
        producto.quantity = 1
        cart.products.push(producto)
        await carrito.updateCart(id, cart)
        res.status(200).send({status: 'success', message: 'producto agregado', carrito: carrito.productos})
}
})

//DELETE
router.delete('/:cid', async(req, res) =>{
    const cid = parseInt(req.params.cid)
    res.send({status: "Success", message: await carrito.deleteCart(cid)})
})

export default router;