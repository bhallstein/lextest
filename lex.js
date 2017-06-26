
const tokens = {
	BOOL_TRUE : 'BOOL_TRUE',
	BOOL_FALSE : 'BOOL_FALSE',

	ID : 'ID',

	WHITESPACE : 'WHITESPACE',
	END_OF_INPUT : 'END_OF_INPUT',
};

function mk_token(which, value) {
	return { which, value };
}

const errors = {
	NO_MATCHING_PATTERN : 'NO_MATCHING_PATTERN',
	AMBIGUOUS_GRAMMAR : 'AMBIGUOUS_GRAMMAR',
};

const patterns = [
	[ /true/,  tokens.BOOL_TRUE  ],
	[ /false/, tokens.BOOL_FALSE ],
	[ /^[_a-z][a-zA-Z0-9]+/, tokens.ID ],
	[ /^\s+/, tokens.WHITESPACE ],
];

function get_match(input, i) {
	if (i >= input.length - 1) {
		return tokens.END_OF_INPUT;
	}

	var results = patterns
		.map(function(s) {
			const regex = s[0];
			const token = s[1];

			var result = input.match(regex);
			if (result !== null) {
				result = result[0];
			}

			return { token, result };
		})
		.filter((r) => (r.result !== null))
		.sort((a, b) => b.result.length - a.result.length);

	if (results.length === 0) {
		return errors.NO_MATCHING_PATTERN;
	}

	return mk_token(results[0]['token'], results[0]['result']);
}


function lex(input) {
	var error = false;
	var i = 0;

	var out = [ ];
	function emit(t) { out.push(t); }

	while (true) {
		var m = get_match(input, i);

		if (m === tokens.END_OF_INPUT) {
			break;
		}

		if (errors[m] === m) {
			console.log("Error: ", m, "(@'" + input.substr(0,20) + "...')");
			error = true;
			break;
		}

		i += m.value.length;
		// console.log(i);
		// input = input.substr(m.value.length);

		if (m.which === tokens.WHITESPACE) {
			continue;
		}

		emit(m);
	}

	return error ? null : out;
}

var s = Array(100000).join('false falseyness  true ');

var parse_result = lex(s);
// console.log(parse_result);

