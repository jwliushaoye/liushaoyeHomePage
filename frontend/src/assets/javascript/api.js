// axios  封装
  import Axios from 'axios';
import Qs from 'qs'

//
function encodeingRequestData(data) {
  let res = {};
  for(let [key , value] of Object.entries(data)){
    if(value == null) {
      res[key] = ''
    }else if (typeof value == 'string'){
      res[key] = value
    }else if(typeof value == 'object'){
      res[key] = JSON.stringify(res[value])
    }
  };
  return res;
}

//axios : api
export async function api(url , data = {} , method) {
  console.log(`back-api : ${url}` , data);
  if (typeof data !== 'object') {
    throw Error('back-api: Post error! data is not object')
  };
  
  let req_data = encodeingRequestData(data);
  let res = await Axios[method](url , Qs.stringify(req_data));
  
  if(res.status >= 400 && res.status <= 600) {
    throw Error(`back-api : status ${res.status} caught!`)
  }else {
    return res.data;
  }
}
