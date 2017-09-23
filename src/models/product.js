//Vamos criar um Schema, utilizando o mongoose para aplicar as validações : Ex not null, required, etc
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//o que compõe  um produto, em json
const schema = new Schema({
    //o schema cria automaticamente um _id para gerenciar (guid)
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug: { // Cadeira Gamer = cadeira-gamer (slug desse Cadeira Gamer)
        type: String,
        required: [true, 'O slug é obrigatório'],
        trim: true,
        index: true, //Busca por ele, para facilitar a busca, por isso o index
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number, //é para tudo, int, decimal, etc
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{  //array
        type: String,
        required: true
    }],
    image:{ //armazena o caminho da imagem
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Product', schema);