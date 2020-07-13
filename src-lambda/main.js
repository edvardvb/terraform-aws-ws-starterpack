'use strict'

const random = Math.floor(Math.random() * 101)

exports.handler = function (event, context, callback) {
  var response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ randomNumber: random })
  }
  callback(null, response)
}