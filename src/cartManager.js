import fs from 'fs'

export default class CartManager {
    constructor(){
        this.path = './carrito.json'
        this.cart = []
        
    }

    readCartFile = async () =>{
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        }catch (error){
            return []
        }
    }

    getCarts = async() => {
        try{
            return await this.readCartFile()
        }
        catch (error){
            return new Error(error)
        }
    }
    
    getCartById = async (id) => {
        try {
            this.cart = await this.readCartFile()
            console.table(this.cart)
            return this.cart.find(ct => ct.id === id)
        }catch (error){
            return new Error(error) 
        }
    }

    addCart  = async (newCart) => {   
        try{
            this.cart = await this.getCarts()
            if (this.cart.length === 0 ) {
                newCart.id = 1
            } else {
                newCart.id = this.cart[this.cart.length - 1].id + 1
            }
            newCart.products = []
            this.cart.push(newCart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.cart,'utf-8','\t'))
            return 'Carrito generado'
        }catch (error){
            return new Error(error)
        }
	}	

    updateCart = async (id, updCart) => {
        try{
            const parseCarts = await this.readCartFile()
            const findId = parseCarts.findIndex(ct => ct.id == id)
            if (findId === -1) return { status: "error", message: 'Id carrito no existe' }
            const returnedTarget = Object.assign(parseCarts[id - 1], updCart)
            parseCarts[id - 1] = returnedTarget
            this.cart = parseCarts
            await fs.promises.writeFile(this.path, JSON.stringify(this.cart,'utf-8','\t'))
            return 'Carrito Actualizado'
            }
        catch (error){
            return new Error(error)
        }
    }

    deleteCart  = async (idDelete) => {
        try{
            this.cart = await this.readCartFile()
            const remove = this.cart.filter(ct => ct.id !== idDelete) // filtramos
            if (this.cart.length === remove.length){
                return 'Id no encontrado'
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify(remove,'utf-8','\t'))
                return 'Producto eliminado'
            }
            
        }
        catch (error){
            return new Error(error)
        }
    }
}