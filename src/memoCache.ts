



class ZMap<K,V>  {
  constructor(
    private readonly map:Map<K,V>,
    private readonly  ctx:any
    ) {
      let n = new Map();


      

      // this 与ctx合并
      //@ts-ignore
    return Object.assign(n.__proto__,ctx)
  }


  set(k,v) {
    this.map.set(k,v);
    return this;
  }

}

let me = new Map();

let m = new ZMap(me, {

});

