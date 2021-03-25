 const Block=require('./block')
 describe('Block',()=>{
    const timestamp='a-date';
    const lastHash='foo-lasthash';
    const hash='foo-hash';
    const data=['blockchain','data'];
    const block= new Block({timestamp,lastHash,hash,data});
    

it('has a timestamp,lastHash,hash,data property',()=>{
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
});
});