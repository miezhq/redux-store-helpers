import { DEFAULT_MOUNT_POINT } from './constants';

let mountPoint:string = null;

export function getMountPoint(): string {
  return mountPoint || DEFAULT_MOUNT_POINT
}

export function setMountPoint(name:string) {
  mountPoint = name;
}
