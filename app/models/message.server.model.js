'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	group: {
		type: Schema.ObjectId,
		ref: 'Group'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	tousers: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	message: {
		type: String,
		default: '',
		required: 'Please fill Message name',
		trim: true
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Message', MessageSchema);