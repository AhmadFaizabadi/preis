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

return {loading, loadUser, saveUser, registerUser}
}
