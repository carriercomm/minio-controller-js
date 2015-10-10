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

import JSONrpc from './jsonrpc'

export default class Controller {
  constructor(endpoint, accessKey, secretKey) {
    var namespace = 'Controller'
    this.JSONrpc = new JSONrpc({
      endpoint, namespace, accessKey, secretKey
    })
  }
  makeCall(method, options) {
    return this.JSONrpc.call(method, {
      params: [options]
    })
  }
  GetVersion() {
    return this.makeCall("GetVersion")
  }
  GenerateAuth(user) {
    return this.makeCall("GenerateAuth", {user});
  }
  FetchAuth(user) {
    return this.makeCall("FetchAuth", {user});
  }
  ResetAuth(user) {
    return this.makeCall("ResetAuth", {user})
  }
  AddServer(args) {
    return this.makeCall("AddServer", args)
  }
  ListServers() {
    return this.makeCall("ListServers")
  }
  GetServerMemStats(args) {
    return this.makeCall("GetServerMemStats", args)
  }
  GetServerDiskStats(args) {
    return this.makeCall("GetServerDiskStats", args)
  }
  GetServerSysInfo(args) {
    return this.makeCall("GetServerSysInfo", args)
  }
  GetServerVersion(args) {
    return this.makeCall("GetServerVersion", args)
  }
  DiscoverServers(args) {
    return this.makeCall("DiscoverServers", args)
  }
  GetControllerNetInfo() {
    return this.makeCall("GetControllerNetInfo")
  }
  StorageStats(host) {
    return this.makeCall("StorageStats", host)
  }
  RebalanceStats(host) {
    return this.makeCall("RebalaceStats", host)
  }
}
