/**
 * CP的VI接口相关的单元测试
 * Creted by liub 2019.8.30
 */

let {gameconn} = require('gamerpc');
let nfetch = require('node-fetch');
let connector = new gameconn({"UrlHead": "http", "webserver": {"host": "127.0.0.1", "port": 9701}}).setFetch(nfetch);

describe('TEST', function() {
    it('test echo', async () => {
        let msg = await connector.fetching({func: "cp.echo"});
        console.log(msg);
    });

    it('test get cpinfo', async () => {
        let msg = await connector.get('http://127.0.0.1:9701/mock/3');
        console.log(msg);
    });

    it('test get usertoken', async () => {
        let msg = await connector.get('http://127.0.0.1:9701/mock/3/user/2');
        console.log(msg);
    });
});
