const assert = require('assert')
//引入游戏云连接器，创建连接器对象
const {generateKey, signObj, verifyObj, verifyData} = require('gamerpc')

let key = generateKey('1111111111111111111111111111111111111111111111111111111111111111');
let packet = {
    data: {
        pubkey: key.public,
        content: 'helloworld',
    }
}

describe.only('加密与验证', () => {
    it('签名', async () => {
        packet.sig = signObj(packet.data, key.private);
    });

    it('验签', async () => {
        assert(verifyObj(packet.data, packet.sig, packet.data.pubkey)== true);
    });
});
