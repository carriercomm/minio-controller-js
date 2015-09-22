import JsonRPC from './jsonrpc'

export default class Controller {
    constructor(endpoint) {
        var namespace = 'Controller'
        this.JsonRPC = new JsonRPC({endpoint, namespace})
    }
    makeCall(method, options) {
        return this.JsonRPC.call(method, {params:[options]})
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
}
