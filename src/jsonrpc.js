/*
 * Isomorphic Javascript library for Minio Controller API, (C) 2015 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import SuperAgent from 'superagent-es6-promise';

class JSONrpc extends SuperAgent {
  // new JSONrpc({endpoint: '...', namespace: '...'})
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
    return SuperAgent.post(this.endpoint)
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

export default JSONrpc;
