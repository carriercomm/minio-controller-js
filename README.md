# Isomorphic Javascript library for Minio Controller API

## Usage

```js
var Ctrl = require('minio-controller-js');

var Controller = new Ctrl("http://<CONTROLLER-IPADDRESS:9001/rpc");

Controller.APIMETHOD(ARGUMENT)
    .then(function(data) {
        console.log("success : ", data);
    })
    .catch(function(error) {
        console.log("fail : ", error.toString());
    });
```

## List of Controller APIs implemented
=======
* GenerateAuth("admin")
* FetchAuth("admin")
* ResetAuth("admin")
* AddServer({host:192.168.1.2})
* ListServers()
* GetServerMemStats({host:192.168.1.2})
* GetServerDiskStats({host:192.168.1.2})
* GetServerSysInfo({host:192.168.1.2})
* GetServerVersion({host:192.168.1.2})
* StorageStats()
* RebalanceStats()

[GenerateAuth("myuser")](./examples/gen-auth.js)

[FetchAuth("myuser")](./examples/fetch-auth.js)

[ResetAuth("myuser")](./examples/reset-auth.js)

[AddServer({host:192.168.1.2})](./examples/add-server.js)

[ListServers()](./examples/list-servers.js)

[GetServerMemStats({host:192.168.1.2})](./examples/get-server-memstats.js)

[GetServerDiskStats({host:192.168.1.2})](./examples/get-server-diskstats.js)

[GetServerSysInfo({host:192.168.1.2})](./examples/get-server-sysinfo.js)

[GetServerVersion({host:192.168.1.2})](./examples/get-server-version.js)

## More Examples

```js
var Ctrl = require('minio-controller-js');

var Controller = new Ctrl("http://192.168.1.2:9001/rpc");

// Generate S3 key/secret
Controller.GenerateAuth("admin")
    .then(function(data) {
        console.log("success : ", data);
    })
    .catch(function(error) {
        console.log("fail : ", error.toString());
    });


// Add 3 servers
Controller.AddServer({host:"192.168.1.2"})
    .then(function(data) {
        return Controller.AddServer({host:"192.168.1.3"})
    })
    .then(function(data) {
        return Controller.AddServer({host:"192.168.1.4"})
    })
    .then(function(data) {
        // List added servers
        return Controller.ListServers()
    })
    .then(function(data) {
        console.log("success : ", data);
    })
    .catch(function(error) {
        console.log("fail : ", error.toString());
    });

// Get Server memory stats
Controller.GetServerMemStats({host:"192.168.1.4"})
    .then(function(data) {
        console.log("success : ", data);
    })
    .catch(function(error) {
        console.log("fail : ", error.toString());
    });
