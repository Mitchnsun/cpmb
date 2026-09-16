import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Native dimensions read straight from the file header, JPEG and PNG only.
 *
 * The content JSON declares each image's size so `next/image` reserves the
 * right box before it loads; reading the file itself is what keeps those
 * declarations honest.
 */
export const nativeSize = (url: string): { width: number; height: number } => {
  const data = readFileSync(path.join(process.cwd(), "public", url));

  if (data.readUInt32BE(0) === 0x89504e47) {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }

  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = data[offset + 1];

    /* SOFn frame headers carry the dimensions; DHT/JPG/DAC do not. */
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }

    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    offset += 2 + data.readUInt16BE(offset + 2);
  }

  throw new Error(`Unreadable image header: ${url}`);
};
