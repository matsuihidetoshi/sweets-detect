import { Storage } from 'aws-amplify';
import { StorageAccessLevel, S3ProviderListOutput, S3ProviderPutConfig, PutResult } from '@aws-amplify/storage';
export const levelType: StorageAccessLevel[] = ['public', 'protected', 'private'];
//list用
export interface MyStorageItem {
  level: StorageAccessLevel;
  idx: number;
}
//put
export const putStorage = async (
  key: string,
  object: File,
  config?: S3ProviderPutConfig | undefined
): Promise<PutResult> => {
  return new Promise((resolve, reject) => {
    Storage.put<PutResult>(key, object, config)
      .then(async (result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
};
//get
export const getStorage = async (level: StorageAccessLevel): Promise<S3ProviderListOutput> => {
  return new Promise((resolve, reject) => {
    Storage.list('', { level: level }) // for listing ALL files without prefix, pass '' instead
      .then(async (result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);
  a.click();
  return a;
}
export const downloadFile = async (key: string, level: StorageAccessLevel) => {
  const result = await Storage.get(key, { level: level, download: true });
  if (result.Body) {
    downloadBlob(result.Body as Blob, key);
  }
};