import { promises as fs, existsSync } from "fs";

export default class ProductManager {
    constructor() {
        this.path = './productos.json';
    }

    crearArchivoSiNoExiste = async () => {
        try {
            if (!existsSync(this.path)) {
                await fs.writeFile(this.path, "[]");
            }
        } catch (e) {
            console.log(e);
        }
    }


    leerArchivo = async () => {
        try {
            let listaProductos = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(listaProductos);
            return products;
        } catch (e) {
            console.log('No se pudo leer el archivo:', e);
            return [];
        }
    }

    escribirArchivo = async (listaActualizada) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(listaActualizada), 'utf-8');
            console.log("Se actualizó el archivo data");
        } catch (e) {
            console.log('Error de código', e);
        }
    }


    addProducts = async (Nuevoproducto) => {
        await this.crearArchivoSiNoExiste();

        const productos = await this.leerArchivo()
        const code = productos.find(p => p.code === Nuevoproducto.code)
        if (code === undefined) {
            if (
                Nuevoproducto.title &&
                Nuevoproducto.description &&
                Nuevoproducto.price &&
                Nuevoproducto.thumbnail &&
                Nuevoproducto.code &&
                Nuevoproducto.stock
            ) {
                Nuevoproducto.id = productos.length + 1
                productos.push(Nuevoproducto)
                await this.escribirArchivo(productos)
                console.log("Producto agregado exitosamente");
                return Nuevoproducto
            } else {
                console.log("Uno o mas campos obligatorios requeridos");
                throw {
                    code: 'MISSING_FIELDS',
                    message: 'Uno o mas campos obligatorios requeridos'
                }
            }
        } else {
            console.log("El código del producto ya existe");
            throw {
                code: 'EXISTING_CODE',
                message: 'El código del producto ya existe'
            }
        }
    }


    updateProduct = async (pid, nuevoProducto) => {

        const productos = await this.leerArchivo()
        const { id, ...camposParaActualizar } = nuevoProducto;

        let productoModificado;
        let listaProductosActualizada = [];
        productos.forEach((productoAModificar) => {
            if (productoAModificar.id === pid) {
                productoAModificar = {
                    ...productoAModificar,
                    ...camposParaActualizar
                };
                productoModificado = productoAModificar;
            }
            listaProductosActualizada.push(productoAModificar);
        });
        await this.escribirArchivo(listaProductosActualizada)
        console.log("se modifico el archivo");

        return productoModificado;
    }



    deleteProduct = async (idABorrar) => {
        const productos = await this.leerArchivo()
        const idproducto = productos.find(p => p.id === idABorrar)
        if (idproducto === undefined) {
            console.log("Producto no encontrado, no se puede borrar");
        } else {
            let indiceABorrar = null;
            productos.forEach((elemento, indice) => {
                if (elemento.id === idABorrar) indiceABorrar = indice;
            });
            if (indiceABorrar !== null) {
                productos.splice(indiceABorrar, 1);
                console.log("Borramos el producto");
                this.escribirArchivo(productos);
            } else {
                console.log("no encontramos el indice");
            }
        }

    }

    //Buscar dentro del arreglo por su id
    getProductById = async (id) => {
        const productos = await this.leerArchivo()
        const product = productos.find(p => p.id === id)
        // if (!product) { return 'NOT FOUND' }
        return product
    }

    getProducts = async () => {
        const products = await this.leerArchivo();
        return products
    }

}