import { getUserPayload } from '../utilis/utilsFunct.js';

const {userID,role} = getUserPayload()

localStorage.setItem('userid',userID)



