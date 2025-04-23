const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = mongoose.Schema(
	{
		role: {
			type: String,
			enum: ['Học viên', 'Giáo viên'],
			default: 'Học viên',
		},
		name: {
			type: String,
		},
		userId: {
			type: String,
			unique: true,
		},
		class: {
			type: String,
		},
		dob: {
			type: Date,
		},
		password: {
			type: String,
			minLength: [8, 'Account password contains more than 8 characters'],
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

accountSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

accountSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
	return await bcrypt.compare(pswd, pswdDB);
};

module.exports = mongoose.model('Account', accountSchema);
