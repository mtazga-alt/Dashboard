// تخزين محلي بديل عن سيرفر المنصة (IndexedDB) — للتطبيقات المخصصة وصفحة التحويل والشعار
(function(){
  var DB='qadayti_local_store', ST='records';
  function db(){return new Promise(function(res,rej){var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(ST)};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
  function tx(mode,fn){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction(ST,mode),s=t.objectStore(ST),out;var q=fn(s);if(q)q.onsuccess=function(){out=q.result};t.oncomplete=function(){res(out)};t.onerror=function(){rej(t.error)}})})}
  function key(c,id){return c+'::'+id}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,10)}
  window.__LS={
    getShared:function(c,id){return tx('readonly',function(s){return s.get(key(c,id))}).then(function(v){return v||null})},
    upsertShared:function(c,data,id){id=id||(data&&data.id)||uid();var rec=Object.assign({},data,{id:id});return tx('readwrite',function(s){s.put(rec,key(c,id))}).then(function(){return rec})},
    insertShared:function(c,data,id){id=(typeof id==='string'&&id)||(data&&data.id)||uid();var rec=Object.assign({},data,{id:id,createdAt:new Date().toISOString()});return tx('readwrite',function(s){s.put(rec,key(c,id))}).then(function(){return rec})},
    deleteShared:function(c,id){return tx('readwrite',function(s){s.delete(key(c,id))}).then(function(){return true})},
    selectShared:function(c){return tx('readonly',function(s){return s.getAll(IDBKeyRange.bound(c+'::',c+'::￿'))}).then(function(v){return v||[]})},
    upload:function(file,name){if(name&&typeof name==='object')name=file&&file.name;return new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){res({url:fr.result,name:name||(file&&file.name)||'file',size:file&&file.size})};fr.onerror=function(){rej(fr.error)};fr.readAsDataURL(file)})}
  };
})();
