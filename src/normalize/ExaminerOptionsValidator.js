const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const AjvAbsolutePath = require('webpack/schemas/ajv.absolutePath');
const schema = require('./ExaminerOptions.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
	$data: true
});

AjvKeywords(ajv);
AjvAbsolutePath(ajv);

const validate = ajv.compile(schema);

module.exports = function validator(options) {
	const valid = validate(options);

	if (!valid) {
		validate.errors.forEach(error => {
			console.error(error);
		});

		throw new Error(JSON.stringify(validate.errors, null, '  '));
	}

	return true;
};