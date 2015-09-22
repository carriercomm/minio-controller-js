var superagent = require('superagent-es6-promise');

class JsonRPC extends superagent {
    // new JsonRPC({endpoint: '...', namespace: '...'})
    constructor(params) {
        super(params);
        for (var key in params) {
            this[key] = params[key];
        }
        this.version = '2.0';
    }
    // call('Get', {id: NN, params: [...]}, function() {})
    call(method, options) {
        if (!options) {
            options = {}
        }
        if (!options.id) {
            options.id = 1;
        }
        if (!options.params) {
            options.params = [];
        }
        var dataObj = {
            id: options.id,
            jsonrpc: this.version,
            params: options.params ? options.params : [],
            method: this.namespace ? this.namespace + '.' + method : method
        }
        return superagent.post(this.endpoint)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(dataObj))
                .then(function(res) {
                    if (!res.text)
                        throw new Error("res.text not set in the response")
                    return JSON.parse(res.text).result
                }, function(error) {
                    if (error.res && error.res.text)
                        throw JSON.parse(error.res.text).error
                    throw error
                })
    }
}

export default JsonRPC;
