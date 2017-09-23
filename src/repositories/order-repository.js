'use strict';
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async(data) => {
    var res = await Order
        .find({}, 'number status customer items')
        .populate('customer', 'name')  //irá trazer o customer preenchido
        .populate('items.product', 'title price'); //irá trazer o items.product preenchido

    return res;
}

exports.create = async(data) => {
    var order = new Order(data); 

    await order.save();
}