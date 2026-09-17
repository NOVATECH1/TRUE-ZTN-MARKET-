import {Storage} from '@google-cloud/storage'
let storage:Storage|undefined
function getStorage(){ if(!storage){storage=new Storage({projectId:process.env.GCS_PROJECT_ID,credentials:{client_email:process.env.GCS_CLIENT_EMAIL,private_key:process.env.GCS_PRIVATE_KEY?.replace(/\\n/g,'\n')}})} return storage }
export async function signedDownload(objectKey:string){
 const [url]=await getStorage().bucket(process.env.GCS_BUCKET!).file(objectKey).getSignedUrl({version:'v4',action:'read',expires:Date.now()+24*60*60*1000})
 return url
}
export async function deleteObject(objectKey:string){ await getStorage().bucket(process.env.GCS_BUCKET!).file(objectKey).delete({ignoreNotFound:true}) }
