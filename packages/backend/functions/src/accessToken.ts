import ByteBuf from '@/src/byteBuf';
import crypto = require('crypto');
import crc32 = require('crc-32');
import cuint = require('cuint');

const priviledges = {
  kJoinChannel: 1,
  kPublishAudioStream: 2,
  kPublishVideoStream: 3,
  kPublishDataStream: 4,
  kPublishAudiocdn: 5,
  kPublishVideoCdn: 6,
  kRequestPublishAudioStream: 7,
  kRequestPublishVideoStream: 8,
  kRequestPublishDataStream: 9,
  kInvitePublishAudioStream: 10,
  kInvitePublishVideoStream: 11,
  kInvitePublishDataStream: 12,
  kAdministrateChannel: 101,
  kRtmLogin: 1000,
};

const version = '006';

type Messages = {
  [key: number]: number;
};

class AccessToken {
  private appId: string;
  private appCertificate: string;
  private channelName: string;
  private uid: string;
  private timestamp: number;
  private messages: Messages = {};
  private randomInt = Math.floor(Math.random() * 0xffffffff);

  constructor(appID: string, appCertificate: string, channelName: string, uid: number) {
    this.appId = appID;
    this.appCertificate = appCertificate;
    this.channelName = channelName;
    this.uid = uid === 0 ? '' : `${uid}`;
    this.timestamp = Math.floor(new Date().getTime() / 1000) + 24 * 3600;
  }

  public addPriviledge(priviledge: number, expireTimestamp: number) {
    this.messages = {
      ...this.messages,
      [priviledge]: expireTimestamp,
    };
  }

  private async encodeHMac(key: string, message: Buffer) {
    return crypto.createHmac('sha256', key).update(message).digest();
  }

  public async build() {
    const m = new Message({
      salt: this.randomInt,
      ts: this.timestamp,
      messages: this.messages,
    }).pack();

    const toSign = Buffer.concat([
      Buffer.from(this.appId, 'utf8'),
      Buffer.from(this.channelName, 'utf8'),
      Buffer.from(this.uid, 'utf8'),
      m,
    ]);

    const signature = await this.encodeHMac(this.appCertificate, toSign);

    const crc_channel = cuint
      .UINT32(crc32.str(this.channelName))
      .and(cuint.UINT32(0xffffffff))
      .toNumber();
    const crc_uid = cuint.UINT32(crc32.str(this.uid)).and(cuint.UINT32(0xffffffff)).toNumber();
    const content = new AccessTokenContent({
      signature: signature,
      crc_channel: crc_channel,
      crc_uid: crc_uid,
      m: m,
    }).pack();
    return version + this.appId + content.toString('base64');
  }
}

type MessageOptions = {
  salt: number;
  ts: number;
  messages: Messages;
};

class Message {
  private options: MessageOptions;

  constructor(options: MessageOptions) {
    this.options = options;
  }

  public pack() {
    const out = new ByteBuf();
    return out
      .putUint32(this.options.salt)
      .putUint32(this.options.ts)
      .putTreeMapUInt32(this.options.messages)
      .pack();
  }
}

type AccessTokenContentOptions = {
  signature: ArrayBuffer | SharedArrayBuffer;
  crc_channel: number;
  crc_uid: number;
  m: ArrayBuffer | SharedArrayBuffer;
};

class AccessTokenContent {
  private options: AccessTokenContentOptions;

  constructor(options: AccessTokenContentOptions) {
    this.options = options;
  }

  public pack() {
    const out = new ByteBuf();
    return out
      .putString(this.options.signature)
      .putUint32(this.options.crc_channel)
      .putUint32(this.options.crc_uid)
      .putString(this.options.m)
      .pack();
  }
}

export default AccessToken;
export { priviledges };
