'use strict';
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async() => {
    const res = await Product.find({ //vazio aqui vai buscar todos os campos
            active: true //o primeiro parâmetro do find funciona como se fosse um filtro
        }, 'title price slug');
    
    return res;
}

exports.getBySlug = async(slug) => {    //arrow function do Ecma Script
    const res = await Product.findOne({ //findOne irá trazer somente um ao invés de um array
            slug: slug, //importante observar aqui que esse nome do slug em params, deve ser o mesmo que foi colocado na rota, em product-route
            active: true
        }, 'title description price slug tags');
    
    return res;
}

exports.getById = async(id) => {    
    const res = await Product.findById(id);

    return res;
}

exports.getByTag = async(tag) => {    
    const res = await Product.find({
            tags: tag,
            active: true
        }, 'title description price slug tags');
    
    return res;
}

exports.create = async(data) => {
    var product = new Product(data); //essa passagem é mais simples, porém mais perigosa
    //var product = new Product(); //Forma ideal de se fazer, porque ai temos maior controle
    //product.title = req.body.title;

    await product.save();
}

exports.update = async(id, data) =>{
    await Product
            .findByIdAndUpdate(id, {
                $set: { //o $set vai setar o que veio da requisição para o que vai ser alterado no Produto
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    slug: data.slug
                }
            });
}

exports.delete = async(id) => {
    await Product.findOneAndRemove(id);
}