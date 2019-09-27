import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { Observable, Observer } from 'rxjs';

declare var ObsClient: any;

const accessKeyId = 'U2FE9KWXFICE2TAD4QTO';
const secertAccessKey = 'OGzrIprZYwbaH1VB4ko4inALycEnFguImnbu218O';
const serverEndPoint = 'obs.cn-east-2.myhuaweicloud.com';
const bucket = 'meishang-mobile-bucket';
const timeOut = 60 * 60; // 1小时
const obsClient = new ObsClient({
  access_key_id: accessKeyId,
  secret_access_key: secertAccessKey,
  server: `https://${serverEndPoint}`,
  timeout: timeOut
});

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
// 将blob转换为file
function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

/**
 * 上传华为云OBS
 * https://support.huaweicloud.com/sdk-browserjs-devg-obs/zh-cn_topic_0142816182.html
 * @export
 * @class CosService
 */
@Injectable({ providedIn: 'root' })
export class ESdkObsService {
  private uploadSizeLimit = 10 * 1024 * 1024;
  private singlePartSize = 200 * 1024;

  uploadFile(file: File): Observable<string | number> {
    console.log(`ESdkObsService uploadFile: `, file);
    const ext = file.name.slice(file.name.lastIndexOf('.'));
    console.log(ext +"========ext=========")
    console.log('我到上传视频这里了！')
    // if (file.size > this.uploadSizeLimit) {
      return this.breakpointUploadFile(file);
    // }

    // const key = uuid.v4();
    // const obs = Observable.create((observer: Observer<string | number>) => {
    //   obsClient
    //     .putObject({
    //       Bucket: bucket,
    //       Key: key+ext,
    //       SourceFile: file
    //     })
    //     .then(result => {
    //       if (result.CommonMsg.Status < 300) {
    //         observer.next(this.resolveLocation(key, ext));
    //         observer.complete();
    //       } else {
    //         console.log('Code-->' + result.CommonMsg.Code);
    //         console.log('Message-->' + result.CommonMsg.Message);
    //         observer.error(new Error(result.CommonMsg.Message));
    //       }
    //     })
    //     .catch(err => {
    //       console.error('Error-->' + err);
    //       observer.error(err);
    //     });
    
    //     return () => {}
    
    //   });

    // return obs;
  }

  uploadImage(base64ImageStr: string): Observable<string | number> {
    console.log(`ESdkObsService uploadImage: `);
    console.log('我又正常了！')
    const blob = dataURLtoBlob(base64ImageStr);
    const file = blobToFile(blob, 'filename');
    return this.UploadImageFun(file)
  }
  private UploadImageFun(file: File): Observable<string> {
    const ext = file.name.slice(file.name.lastIndexOf('.')); 
    const key = uuid.v4();
    const obs = Observable.create((observer: Observer<string | number>) => {
      obsClient
        .putObject({
          Bucket: bucket,
          Key: key+ext,
          SourceFile: file
        })
        .then(result => {
          if (result.CommonMsg.Status < 300) {
            observer.next(this.resolveLocation(key, ext));
            observer.complete();
          } else {
            console.log('Code-->' + result.CommonMsg.Code);
            console.log('Message-->' + result.CommonMsg.Message);
            observer.error(new Error(result.CommonMsg.Message));
          }
        })
        .catch(err => {
          console.error('Error-->' + err);
          observer.error(err);
        });
    
        return () => {}
    
      });

    return obs;
   
  }
  private breakpointUploadFile(file: File): Observable<string | number> {
    console.log(`ESdkObsService breakpointUploadFile: `, file);

    const key = uuid.v4();
    const ext = file.name.slice(file.name.lastIndexOf('.')); 
    const obs = Observable.create((observer: Observer<string | number>) => {
      var cp;
      var hook;
      obsClient.uploadFile(
        {
          Bucket: bucket,
          Key: key + ext,
          SourceFile: file,
          PartSize: this.singlePartSize,
          TaskNum: 20,
          ProgressCallback: function (
            transferredAmount,
            totalAmount,
            totalSeconds
          ) {
            // console.log((transferredAmount * 1.0) / totalSeconds / 1024);
            // console.log((transferredAmount * 100.0) / totalAmount);
            observer.next((transferredAmount * 100.0) / totalAmount)
            if (hook && transferredAmount / totalAmount > 0.5) {
              // 暂停断点续传任务
              hook.cancel();
            }
          },
          EventCallback: (eventType, eventParam, eventResult) => {
            // 处理事件响应
            // console.log(
            //   `EventCallback: `,
            //   'eventType: ',
            //   eventType,
            //   'eventParam: ',
            //   eventParam,
            //   'eventResult: ',
            //   eventResult
            // );
          },
          ResumeCallback: (resumeHook, uploadCheckpoint) => {
            // 获取取消断点续传上传任务控制参数
            hook = resumeHook;
            // 记录断点
            cp = uploadCheckpoint;
          }
        },
        (err, result) => {
          // console.error('Error1-->' + err);
          // 出现err，再次调用断点续传接口，继续上传任务
          if (err) {
            obsClient.uploadFile(
              {
                UploadCheckpoint: cp,
                ProgressCallback: function (
                  transferredAmount,
                  totalAmount,
                  totalSeconds
                ) {
                  // console.log((transferredAmount * 1.0) / totalSeconds / 1024);
                  // console.log((transferredAmount * 100.0) / totalAmount);
                  observer.next((transferredAmount * 100.0) / totalAmount)
                },
                EventCallback: (eventType, eventParam, eventResult) => {
                  // 处理事件响应
                  // console.log(
                  //   `EventCallback: `,
                  //   'eventType: ',
                  //   eventType,
                  //   'eventParam: ',
                  //   eventParam,
                  //   'eventResult: ',
                  //   eventResult
                  // );
                }
              },
              (err, result) => {
                if (err) {
                  console.error('Error2-->' + err);
                  observer.error(err);
                } else {
                  if (result.CommonMsg.Status < 300) {
                    console.log(
                      'RequestId-->' + result.InterfaceResult.RequestId
                    );
                    console.log('Bucket-->' + result.InterfaceResult.Bucket);
                    console.log('Key-->' + result.InterfaceResult.Key);
                    console.log(
                      'Location-->' + result.InterfaceResult.Location
                    );
                    observer.next(this.resolveLocation(key, ext));
                    observer.complete();
                  } else {
                    console.log('Code-->' + result.CommonMsg.Code);
                    console.log('Message-->' + result.CommonMsg.Message);
                    observer.error(
                      new Error(`result.CommonMsg: ${result.CommonMsg.Message}`)
                    );
                  }
                }
              }
            );
          } else {
            console.log('Status-->' + result.CommonMsg.Status);
            if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
              console.log('RequestId-->' + result.InterfaceResult.RequestId);
              observer.next(this.resolveLocation(key, ext));
              observer.complete();
            } else {
              observer.error(
                new Error(`result.CommonMsg: ${result.CommonMsg.Message}`)
              );
            }
          }
        }
      );

      return () => {
        if (hook) {
          console.log(`cancel task uploading.`)
          hook.cancel()
        }
      }
    });

    return obs;
  }

  private resolveLocation(key: string, ext: string): string {
    return `https://${bucket}.${serverEndPoint}/${key}${ext}`;
  }
}
