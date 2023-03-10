'useStrict';

import Ajv from "ajv/dist/jtd.js"


export default function checkAJV(schema, data) {
    const ajv = new Ajv({validateSchema: false, strict: false }); // options can be passed, e.g. {allErrors: true}

    
    const validate = ajv.compile(schema);
    const valid = validate(data);

    return valid;

}

