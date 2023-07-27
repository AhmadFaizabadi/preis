import { LocalStorage } from "quasar";
export default function useUserServices() {
let loading=false
function loadUser(){
  const user = LocalStorage.getItem('user')
  return user
}

function saveUser(user){
  LocalStorage.set('user', user)
}

async function registerUser(user){

}
function pushOutbox(name){}
function popOutbox(name){}
return {loading, loadUser, saveUser, registerUser, pushOutbox,popOutbox}
}
