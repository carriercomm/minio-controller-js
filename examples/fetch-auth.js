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

var Ctrl = require('minio-controller-js');
var Controller = new Ctrl("http://<YOUR-CONTROLLER-ENDPOINT>/rpc", "YOUR-ACCESSKEYID", "YOUR-SECRETACCESSKEY");

// Generate S3 key/secret
Controller.FetchAuth("myuser")
    .then(function(data) {
        console.log("success : ", data);
    })
    .catch(function(error) {
        console.log("fail : ", error.toString());
    });
